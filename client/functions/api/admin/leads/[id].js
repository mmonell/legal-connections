import { requirePermission } from '../../../_shared/adminAuth.js';
import { json } from '../../../_shared/rateLimit.js';

// DELETE /api/admin/leads/:id — superadmin only (see PERMISSIONS in adminAuth.js).
export async function onRequestDelete({ request, env, params }) {
  const session = await requirePermission(env.DB, request, 'delete');
  if (session instanceof Response) return session;

  try {
    const result = await env.DB.prepare('DELETE FROM leads WHERE id = ?').bind(params.id).run();
    if (!result.meta.changes) return json({ ok: false, errors: ['Lead not found'] }, { status: 404 });
    return json({ ok: true });
  } catch (err) {
    console.error('Failed to delete lead:', err);
    return json({ ok: false, errors: ['Could not delete lead'] }, { status: 500 });
  }
}
