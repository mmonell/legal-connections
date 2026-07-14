import { bearerToken, getSession } from '../../_shared/adminAuth.js';
import { json } from '../../_shared/rateLimit.js';

export async function onRequestGet({ request, env }) {
  const session = await getSession(env.DB, bearerToken(request));
  if (!session) return json({ ok: false, errors: ['Not signed in'] }, { status: 401 });
  return json({
    ok: true,
    user: { email: session.email, role: session.role, permissions: session.permissions },
  });
}
