import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';

const IS_PROD = !!process.env.KV_REST_API_URL;

// Constant-time compare to avoid a remote timing oracle on the admin secret.
// timingSafeEqual requires equal-length buffers, so length-mismatched inputs
// short-circuit to false without ever calling the underlying compare.
function safeBearerEqual(provided, expected) {
  const a = Buffer.from(provided, 'utf8');
  const b = Buffer.from(expected, 'utf8');
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// Rate limit: 10 reads per IP per 60s (guards against token brute-force)
const RATE_LIMIT = 10;
const RATE_WINDOW_SECS = 60;
const rateLimitMap = new Map();

function isRateLimitedLocal(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, windowStart: now };
  if (now - entry.windowStart > RATE_WINDOW_SECS * 1000) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  rateLimitMap.set(ip, { count: entry.count + 1, windowStart: entry.windowStart });
  return false;
}

async function isRateLimitedKv(ip, kv) {
  const key = `rl:admin:${ip}`;
  const count = await kv.incr(key);
  if (count === 1) await kv.expire(key, RATE_WINDOW_SECS);
  return count > RATE_LIMIT;
}

export async function GET(request) {
  // Rate limiting - before auth check to prevent token brute-force
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  if (IS_PROD) {
    const { kv } = await import('@vercel/kv');
    if (await isRateLimitedKv(ip, kv)) {
      return NextResponse.json({ error: 'too many requests' }, { status: 429 });
    }
  } else if (isRateLimitedLocal(ip)) {
    return NextResponse.json({ error: 'too many requests' }, { status: 429 });
  }

  // Protect with a secret token - set SUBMISSIONS_SECRET in Vercel env vars
  const secret = process.env.SUBMISSIONS_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'server misconfigured' }, { status: 500 });
  }
  const auth = request.headers.get('authorization') ?? '';
  if (!safeBearerEqual(auth, `Bearer ${secret}`)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // Pagination — submissions are lpush'd in /api/submit, so list index 0 is the
  // newest. Default page (100) is comfortable for current volume; cap at 200 so
  // a malicious client can't trigger a multi-MB KV read once the list grows.
  const url = new URL(request.url);
  const offsetRaw = parseInt(url.searchParams.get('offset') ?? '0', 10);
  const limitRaw  = parseInt(url.searchParams.get('limit')  ?? '100', 10);
  const offset = Number.isFinite(offsetRaw) && offsetRaw >= 0 ? offsetRaw : 0;
  const limit  = Number.isFinite(limitRaw)  && limitRaw  >  0 ? Math.min(limitRaw, 200) : 100;

  try {
    if (IS_PROD) {
      const { kv } = await import('@vercel/kv');
      // llen + lrange are O(1) and O(N) respectively where N = page size.
      const [total, raw] = await Promise.all([
        kv.llen('submissions'),
        kv.lrange('submissions', offset, offset + limit - 1),
      ]);
      const submissions = raw.map((item) =>
        typeof item === 'string' ? JSON.parse(item) : item
      );
      return NextResponse.json({ submissions, total, offset, limit });
    } else {
      const { readFile } = await import('fs/promises');
      const { default: path } = await import('path');
      const file = path.join(process.cwd(), 'submissions.json');
      let all = [];
      try {
        all = JSON.parse(await readFile(file, 'utf-8'));
      } catch {
        // no submissions file yet
      }
      // Mirror KV's newest-first ordering: submit appends to the file, so reverse.
      const newestFirst = [...all].reverse();
      const submissions = newestFirst.slice(offset, offset + limit);
      return NextResponse.json({ submissions, total: all.length, offset, limit });
    }
  } catch (err) {
    console.error('submissions read error:', err);
    return NextResponse.json({ error: 'internal error' }, { status: 500 });
  }
}
