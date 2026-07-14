import { createUser, listUsers, requirePermission } from '../../../_shared/adminAuth.js';
import { json } from '../../../_shared/rateLimit.js';

export async function onRequestGet({ request, env }) {
  const session = await requirePermission(env.DB, request, 'manageUsers');
  if (session instanceof Response) return session;
  return json({ ok: true, users: await listUsers(env.DB) });
}

export async function onRequestPost({ request, env }) {
  const session = await requirePermission(env.DB, request, 'manageUsers');
  if (session instanceof Response) return session;

  const { email, role } = (await request.json().catch(() => ({}))) || {};
  const result = await createUser(env.DB, email, role);
  if (result.error) return json({ ok: false, errors: [result.error] }, { status: 400 });
  return json({ ok: true, user: result.user }, { status: 201 });
}
