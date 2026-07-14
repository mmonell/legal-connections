import { requirePermission } from '../../../_shared/adminAuth.js';
import { rowToLead } from '../../../_shared/leads.js';
import { json } from '../../../_shared/rateLimit.js';

// GET /api/admin/leads — lead data for the /admin page. Leads contain client
// PII, so this always requires a session with the "view" permission.
export async function onRequestGet({ request, env }) {
  const session = await requirePermission(env.DB, request, 'view');
  if (session instanceof Response) return session;

  try {
    const { results } = await env.DB.prepare('SELECT * FROM leads ORDER BY received_at').all();
    const leads = results.map(rowToLead);
    return json({ ok: true, count: leads.length, leads });
  } catch (err) {
    console.error('Failed to list leads:', err);
    return json({ ok: false, errors: ['Could not read leads'] }, { status: 500 });
  }
}
