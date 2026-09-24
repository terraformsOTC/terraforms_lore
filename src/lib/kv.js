// Redis client for the submissions store and its rate limits.
//
// This was @vercel/kv, which Vercel deprecated when KV moved to Upstash. That
// package only wrapped this same client, built from the same two env vars with
// these same options, so nothing about storage or behaviour changes.
//
// Imported lazily and created on first use, so local dev — where KV_* is unset
// and the routes fall back to submissions.json — never constructs a client.
let client = null;

export async function getKv() {
  if (!client) {
    const { Redis } = await import('@upstash/redis');
    client = new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
      cache: 'default',
      enableAutoPipelining: true,
    });
  }
  return client;
}
