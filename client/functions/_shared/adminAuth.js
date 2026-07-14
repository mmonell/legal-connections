// Passwordless admin auth backed by D1. Ported from the old server/adminAuth.js,
// which used in-memory Maps for sessions/codes — that only worked with a
// single long-running Node process. Workers are stateless per-request, so
// both sessions and pending codes are D1 tables now (see migrations/0001_init.sql).

export const PERMISSIONS = {
  superadmin: ['view', 'download', 'delete', 'manageUsers'],
  admin: ['view', 'download', 'manageUsers'], // no delete
  user: ['view', 'download'],
};

const CODE_TTL_MS = 15 * 60_000; // 15 minutes
const SESSION_TTL_MS = 12 * 60 * 60_000; // 12 hours
const MAX_CODE_ATTEMPTS = 5;

function normalize(email) {
  return String(email || '').trim().toLowerCase();
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalize(email));
}

export async function listUsers(db) {
  const { results } = await db
    .prepare('SELECT email, role, created_at AS createdAt FROM admin_users ORDER BY created_at')
    .all();
  return results;
}

export async function findUser(db, email) {
  return db
    .prepare('SELECT email, role, created_at AS createdAt FROM admin_users WHERE email = ?')
    .bind(normalize(email))
    .first();
}

export async function createUser(db, email, role) {
  const clean = normalize(email);
  if (!isValidEmail(clean)) return { error: 'A valid email is required' };
  // New users can only be admin or user; the superadmin is seeded, not created.
  if (role !== 'admin' && role !== 'user') return { error: 'Role must be admin or user' };
  const existing = await findUser(db, clean);
  if (existing) return { error: 'That user already exists' };
  const createdAt = new Date().toISOString();
  await db
    .prepare('INSERT INTO admin_users (email, role, created_at) VALUES (?, ?, ?)')
    .bind(clean, role, createdAt)
    .run();
  return { user: { email: clean, role, createdAt } };
}

export async function requestCode(db, email) {
  const user = await findUser(db, email);
  if (!user) return null; // caller must not reveal whether the email exists
  const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 900000 + 100000);
  const token = crypto.randomUUID().replace(/-/g, '');
  await db
    .prepare(
      'INSERT INTO admin_login_codes (email, code, token, expires_at, attempts) VALUES (?, ?, ?, ?, 0) ' +
      'ON CONFLICT(email) DO UPDATE SET code = excluded.code, token = excluded.token, expires_at = excluded.expires_at, attempts = 0'
    )
    .bind(user.email, code, token, Date.now() + CODE_TTL_MS)
    .run();
  return { user, code, token };
}

// Verify either { email, code } (typed code) or { token } (magic link).
export async function verify(db, { email, code, token }) {
  let entry;
  if (token) {
    entry = await db
      .prepare('SELECT * FROM admin_login_codes WHERE token = ?')
      .bind(token)
      .first();
  } else {
    entry = await db
      .prepare('SELECT * FROM admin_login_codes WHERE email = ?')
      .bind(normalize(email))
      .first();
  }
  if (!entry || entry.expires_at < Date.now()) return null;
  if (!token) {
    const attempts = entry.attempts + 1;
    if (attempts > MAX_CODE_ATTEMPTS) {
      await db.prepare('DELETE FROM admin_login_codes WHERE email = ?').bind(entry.email).run();
      return null;
    }
    if (entry.code !== String(code || '').trim()) {
      await db.prepare('UPDATE admin_login_codes SET attempts = ? WHERE email = ?').bind(attempts, entry.email).run();
      return null;
    }
  }
  await db.prepare('DELETE FROM admin_login_codes WHERE email = ?').bind(entry.email).run(); // single use
  return entry.email;
}

export async function createSession(db, email) {
  const user = await findUser(db, email);
  if (!user) return null;
  const sid = crypto.randomUUID().replace(/-/g, '');
  await db
    .prepare('INSERT INTO admin_sessions (sid, email, role, expires_at) VALUES (?, ?, ?, ?)')
    .bind(sid, user.email, user.role, Date.now() + SESSION_TTL_MS)
    .run();
  return { sid, user };
}

export async function getSession(db, sid) {
  if (!sid) return null;
  const row = await db.prepare('SELECT * FROM admin_sessions WHERE sid = ?').bind(sid).first();
  if (!row || row.expires_at < Date.now()) {
    if (row) await db.prepare('DELETE FROM admin_sessions WHERE sid = ?').bind(sid).run();
    return null;
  }
  return { email: row.email, role: row.role, permissions: PERMISSIONS[row.role] || [] };
}

export async function destroySession(db, sid) {
  if (sid) await db.prepare('DELETE FROM admin_sessions WHERE sid = ?').bind(sid).run();
}

export function bearerToken(request) {
  return (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
}

// Resolves the caller's session and checks a required permission. Returns the
// session on success, or a ready-to-return Response (401/403) on failure —
// callers do `const s = await requirePermission(...); if (s instanceof Response) return s;`
export async function requirePermission(db, request, permission) {
  const session = await getSession(db, bearerToken(request));
  if (!session) {
    return jsonResponse({ ok: false, errors: ['Not signed in'] }, 401);
  }
  if (!session.permissions.includes(permission)) {
    return jsonResponse({ ok: false, errors: ['Your role does not allow this'] }, 403);
  }
  return session;
}

function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
