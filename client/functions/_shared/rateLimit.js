// Naive per-IP rate limit, ported from the old in-memory Map in server/index.js.
// Workers don't share memory across requests/isolates, so hits live in D1;
// old rows are pruned on every call so the table doesn't grow unbounded.
const WINDOW_MS = 60_000;
const MAX_HITS = 10;

export async function rateLimited(db, ip) {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  await db.prepare('DELETE FROM rate_limit_hits WHERE hit_at < ?').bind(windowStart).run();
  const { count } = await db
    .prepare('SELECT COUNT(*) AS count FROM rate_limit_hits WHERE ip = ? AND hit_at >= ?')
    .bind(ip, windowStart)
    .first();
  await db.prepare('INSERT INTO rate_limit_hits (ip, hit_at) VALUES (?, ?)').bind(ip, now).run();
  return count + 1 > MAX_HITS;
}

export function clientIp(request) {
  return request.headers.get('cf-connecting-ip') || 'unknown';
}

export function json(data, init = {}) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { 'content-type': 'application/json', ...(init.headers || {}) },
  });
}
