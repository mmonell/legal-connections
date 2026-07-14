import { buildLeadPatch, validateLead } from '../../_shared/leads.js';
import { clientIp, json, rateLimited } from '../../_shared/rateLimit.js';

// PATCH /api/leads/:id — progressive updates from the avatar intake: each
// answer is saved as it arrives.
export async function onRequestPatch({ request, env, params }) {
  const db = env.DB;
  const ip = clientIp(request);
  if (await rateLimited(db, ip)) {
    return json({ ok: false, errors: ['Too many requests, please call us instead.'] }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) || {};
  const errors = validateLead({ ...body, source: 'avatar-intake' });
  if (errors.length) return json({ ok: false, errors }, { status: 400 });

  const patch = buildLeadPatch(body);
  if (!Object.keys(patch).length) {
    return json({ ok: false, errors: ['Nothing to update'] }, { status: 400 });
  }
  patch.updated_at = new Date().toISOString();

  try {
    const cols = Object.keys(patch);
    const setClause = cols.map((c) => `${c} = ?`).join(', ');
    const result = await db
      .prepare(`UPDATE leads SET ${setClause} WHERE id = ?`)
      .bind(...cols.map((c) => patch[c]), params.id)
      .run();
    if (!result.meta.changes) return json({ ok: false, errors: ['Lead not found'] }, { status: 404 });
    return json({ ok: true, id: params.id });
  } catch (err) {
    console.error('Failed to update lead:', err);
    return json({ ok: false, errors: ['Something went wrong. Please call us.'] }, { status: 500 });
  }
}
