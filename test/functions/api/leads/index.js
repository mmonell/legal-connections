import { buildLeadRow, validateLead } from '../../_shared/leads.js';
import { clientIp, json, rateLimited } from '../../_shared/rateLimit.js';

// POST /api/leads — creates a lead. The homepage/service-page avatar intake
// calls this once (first answered question), then PATCHes /api/leads/:id for
// every answer after that (see [id].js).
export async function onRequestPost({ request, env }) {
  const db = env.DB;
  const ip = clientIp(request);
  if (await rateLimited(db, ip)) {
    return json({ ok: false, errors: ['Too many requests, please call us instead.'] }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const errors = validateLead(body);
  if (errors.length) return json({ ok: false, errors }, { status: 400 });

  try {
    const row = buildLeadRow(body);
    const cols = Object.keys(row);
    const placeholders = cols.map(() => '?').join(', ');
    await db
      .prepare(`INSERT INTO leads (${cols.join(', ')}) VALUES (${placeholders})`)
      .bind(...cols.map((c) => row[c]))
      .run();
    return json({ ok: true, id: row.id }, { status: 201 });
  } catch (err) {
    console.error('Failed to save lead:', err);
    return json({ ok: false, errors: ['Something went wrong. Please call us.'] }, { status: 500 });
  }
}
