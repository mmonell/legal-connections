import { bearerToken, destroySession } from '../../../_shared/adminAuth.js';
import { json } from '../../../_shared/rateLimit.js';

export async function onRequestPost({ request, env }) {
  await destroySession(env.DB, bearerToken(request));
  return json({ ok: true });
}
