import { NextResponse } from 'next/server';
import { getKv } from '@/lib/kv';

// Use Vercel KV in production; fall back to local JSON file in dev
const IS_PROD = !!process.env.KV_REST_API_URL;

// Rate limit: 5 submissions per IP per 60 seconds
const RATE_LIMIT = 5;
const RATE_WINDOW_SECS = 60;

// In-memory fallback for local dev (per-process, not shared across workers)
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

// KV-backed rate limiter - survives cold starts; uses Redis INCR + EXPIRE
async function isRateLimitedKv(ip, kv) {
  const key = `rl:${ip}`;
  const count = await kv.incr(key);
  if (count === 1) {
    // First hit in this window - set the TTL
    await kv.expire(key, RATE_WINDOW_SECS);
  }
  return count > RATE_LIMIT;
}

// Max POST body: 8 KB - more than enough for a reference submission
const MAX_BODY_BYTES = 8 * 1024;

// Allowed origins for CSRF protection
const ALLOWED_ORIGINS = [
  'https://terraformlore.xyz',
  'https://www.terraformlore.xyz',
  'https://terraform-lore.vercel.app',
];

// Local dev fallback - write to submissions.json
async function saveLocally(entry) {
  const { writeFile, readFile } = await import('fs/promises');
  const { default: path } = await import('path');
  const file = path.join(process.cwd(), 'submissions.json');
  let submissions = [];
  try {
    submissions = JSON.parse(await readFile(file, 'utf-8'));
  } catch {
    // file doesn't exist yet
  }
  submissions.push(entry);
  await writeFile(file, JSON.stringify(submissions, null, 2), 'utf-8');
}

export async function POST(request) {
  try {
    // CSRF: verify origin in production
    if (IS_PROD) {
      const origin = request.headers.get('origin');
      if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
        return NextResponse.json({ error: 'forbidden' }, { status: 403 });
      }
    }

    // Rate limiting: 5 submissions per IP per 60s
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    let limited;
    if (IS_PROD) {
      const kv = await getKv();
      limited = await isRateLimitedKv(ip, kv);
    } else {
      limited = isRateLimitedLocal(ip);
    }
    if (limited) {
      return NextResponse.json({ error: 'too many requests' }, { status: 429 });
    }

    // Reject oversized bodies before parsing (read as text to enforce real size)
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: 'request too large' }, { status: 413 });
    }

    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: 'invalid JSON' }, { status: 400 });
    }
    const { type, zone, reference, explanation, sourceLink, handle } = body ?? {};

    if (!zone || !reference || !explanation) {
      return NextResponse.json({ error: 'missing required fields' }, { status: 400 });
    }

    const entry = {
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
      type: type === 'biome' ? 'biome' : 'zone',
      zone:        String(zone).slice(0, 100),
      reference:   String(reference).slice(0, 200),
      explanation: String(explanation).slice(0, 2000),
      sourceLink:  sourceLink && /^https?:\/\//i.test(String(sourceLink))
                     ? String(sourceLink).slice(0, 500) : null,
      handle:      handle     ? String(handle).slice(0, 50)      : null,
    };

    if (IS_PROD) {
      const kv = await getKv();
      await kv.lpush('submissions', JSON.stringify(entry));
    } else {
      await saveLocally(entry);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('submit error:', err);
    return NextResponse.json({ error: 'internal error' }, { status: 500 });
  }
}
