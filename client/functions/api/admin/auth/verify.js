import { createSession, verify } from '../../../_shared/adminAuth.js';
import { json } from '../../../_shared/rateLimit.js';

export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const { email, code, token } = (await request.json().catch(() => ({}))) || {};
  const verifiedEmail = await verify(db, { email, code, token });
  if (!verifiedEmail) {
    return json({ ok: false, errors: ['Invalid or expired code'] }, { status: 401 });
  }
  const session = await createSession(db, verifiedEmail);
  if (!session) return json({ ok: false, errors: ['Unknown user'] }, { status: 401 });
  return json({
    ok: true,
    session: session.sid,
    user: { email: session.user.email, role: session.user.role },
  });
}
