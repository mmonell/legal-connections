// Single Worker entry point. Cloudflare Workers (unlike classic Pages
// Functions) has no file-based routing — every request comes through this
// fetch handler, so routes are matched manually here. Route logic itself is
// unchanged from the old functions/api/** files; only the dispatch differs.
import { buildLeadPatch, buildLeadRow, isStaticFormSource, rowToLead, validateLead } from './shared/leads.js';
import { clientIp, json, rateLimited } from './shared/rateLimit.js';
import {
  bearerToken,
  createSession,
  createUser,
  destroySession,
  getSession,
  listUsers,
  requestCode,
  requirePermission,
  verify,
} from './shared/adminAuth.js';
import { sendLeadQualificationEmail, sendLoginEmail } from './shared/mailer.js';
import { scoreLeadForService } from './shared/leadScore.js';

// Scores the lead and, the first time this runs for a given lead, emails the
// NEW HOT/WARM/COLD LEAD notification. Called after a lead has its full
// qualification picture: on create for the one-shot case-evaluation-form,
// and on the avatar-intake's final PATCH (client sends intakeComplete: true).
// Best-effort: failures here never fail the caller's save.
async function qualifyAndNotify(env, db, id, row) {
  try {
    const { score, qualification, reasons } = scoreLeadForService(rowToLead(row));
    await db
      .prepare('UPDATE leads SET qualification = ?, qualification_score = ? WHERE id = ?')
      .bind(qualification, score, id)
      .run();
    await sendLeadQualificationEmail(env, { lead: rowToLead(row), score, qualification, reasons });
    await db
      .prepare('UPDATE leads SET qualification_emailed_at = ? WHERE id = ?')
      .bind(new Date().toISOString(), id)
      .run();
  } catch (err) {
    console.error('Failed to qualify/notify lead:', err);
  }
}

async function handleHealth() {
  return json({ ok: true });
}

async function handleLeadsCreate(request, env) {
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
    // The static case-evaluation-form arrives complete in one POST, so it can
    // be qualified immediately. avatar-intake/whatsapp-chat leads normally
    // start with almost no data here and are qualified later, on the
    // intake's final PATCH (see handleLeadsPatch) — except when that PATCH
    // never had a lead to update because this very POST is itself the first
    // save attempt (fallback in lc-avatar.js's finish()), signaled the same
    // way: intakeComplete: true.
    if (isStaticFormSource(row.source) || body.intakeComplete) {
      await qualifyAndNotify(env, db, row.id, row);
    }
    return json({ ok: true, id: row.id }, { status: 201 });
  } catch (err) {
    console.error('Failed to save lead:', err);
    return json({ ok: false, errors: ['Something went wrong. Please call us.'] }, { status: 500 });
  }
}

async function handleLeadsPatch(request, env, id) {
  const db = env.DB;
  // No rate limit here: a PATCH updates an existing lead the visitor already
  // created (POST is where the per-IP limit guards against creation spam). The
  // guided intake saves one PATCH per answer, so a single completed intake can
  // fire 15+ updates — throttling those would silently drop the later answers
  // (contact info, attorney, insurance) and leave the lead unscored.

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
      .bind(...cols.map((c) => patch[c]), id)
      .run();
    if (!result.meta.changes) return json({ ok: false, errors: ['Lead not found'] }, { status: 404 });

    // The guided intake sends intakeComplete: true on its last answer (see
    // lc-avatar.js), which is the first point the lead has enough data to
    // qualify. qualification_emailed_at guards against re-sending if the
    // visitor somehow reaches "done" more than once.
    if (body.intakeComplete) {
      const row = await db.prepare('SELECT * FROM leads WHERE id = ?').bind(id).first();
      if (row && !row.qualification_emailed_at) {
        await qualifyAndNotify(env, db, id, row);
      }
    }

    return json({ ok: true, id });
  } catch (err) {
    console.error('Failed to update lead:', err);
    return json({ ok: false, errors: ['Something went wrong. Please call us.'] }, { status: 500 });
  }
}

async function handleAdminMe(request, env) {
  const session = await getSession(env.DB, bearerToken(request));
  if (!session) return json({ ok: false, errors: ['Not signed in'] }, { status: 401 });
  return json({
    ok: true,
    user: { email: session.email, role: session.role, permissions: session.permissions },
  });
}

async function handleAdminAuthRequest(request, env) {
  const db = env.DB;
  if (await rateLimited(db, clientIp(request))) {
    return json({ ok: false, errors: ['Too many requests'] }, { status: 429 });
  }
  const body = await request.json().catch(() => ({}));
  const pending = await requestCode(db, body?.email);
  // Always answer the same way so account emails can't be probed.
  if (!pending) return json({ ok: true, sent: true });

  const url = new URL(request.url);
  const link = `${url.protocol}//${url.host}/admin?login=${pending.token}`;
  const mail = await sendLoginEmail(env, { to: pending.user.email, code: pending.code, link });
  return json({
    ok: true,
    sent: true,
    // Dev bypass while SES is unconfigured: surface the code to the page.
    ...(mail.devBypass ? { devCode: pending.code, devLink: link } : {}),
  });
}

async function handleAdminAuthVerify(request, env) {
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

async function handleAdminAuthSignout(request, env) {
  await destroySession(env.DB, bearerToken(request));
  return json({ ok: true });
}

async function handleAdminLeadsList(request, env) {
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

async function handleAdminLeadsDelete(request, env, id) {
  const session = await requirePermission(env.DB, request, 'delete');
  if (session instanceof Response) return session;

  try {
    const result = await env.DB.prepare('DELETE FROM leads WHERE id = ?').bind(id).run();
    if (!result.meta.changes) return json({ ok: false, errors: ['Lead not found'] }, { status: 404 });
    return json({ ok: true });
  } catch (err) {
    console.error('Failed to delete lead:', err);
    return json({ ok: false, errors: ['Could not delete lead'] }, { status: 500 });
  }
}

async function handleAdminUsersList(request, env) {
  const session = await requirePermission(env.DB, request, 'manageUsers');
  if (session instanceof Response) return session;
  return json({ ok: true, users: await listUsers(env.DB) });
}

async function handleAdminUsersCreate(request, env) {
  const session = await requirePermission(env.DB, request, 'manageUsers');
  if (session instanceof Response) return session;

  const { email, role } = (await request.json().catch(() => ({}))) || {};
  const result = await createUser(env.DB, email, role);
  if (result.error) return json({ ok: false, errors: [result.error] }, { status: 400 });
  return json({ ok: true, user: result.user }, { status: 201 });
}

// Matches the file-based routes the old functions/api/** tree used to
// provide via Pages. Order matters: more specific paths before dynamic ones.
const ROUTES = [
  { method: 'GET', pattern: /^\/api\/health$/, handler: (req, env) => handleHealth() },
  { method: 'POST', pattern: /^\/api\/leads$/, handler: (req, env) => handleLeadsCreate(req, env) },
  { method: 'PATCH', pattern: /^\/api\/leads\/([^/]+)$/, handler: (req, env, m) => handleLeadsPatch(req, env, m[1]) },
  { method: 'GET', pattern: /^\/api\/admin\/me$/, handler: (req, env) => handleAdminMe(req, env) },
  { method: 'POST', pattern: /^\/api\/admin\/auth\/request$/, handler: (req, env) => handleAdminAuthRequest(req, env) },
  { method: 'POST', pattern: /^\/api\/admin\/auth\/verify$/, handler: (req, env) => handleAdminAuthVerify(req, env) },
  { method: 'POST', pattern: /^\/api\/admin\/auth\/signout$/, handler: (req, env) => handleAdminAuthSignout(req, env) },
  { method: 'GET', pattern: /^\/api\/admin\/leads$/, handler: (req, env) => handleAdminLeadsList(req, env) },
  { method: 'DELETE', pattern: /^\/api\/admin\/leads\/([^/]+)$/, handler: (req, env, m) => handleAdminLeadsDelete(req, env, m[1]) },
  { method: 'GET', pattern: /^\/api\/admin\/users$/, handler: (req, env) => handleAdminUsersList(req, env) },
  { method: 'POST', pattern: /^\/api\/admin\/users$/, handler: (req, env) => handleAdminUsersCreate(req, env) },
];

// Site kill switch. Controlled entirely from the Cloudflare dashboard via the
// SITE_ENABLED environment variable (Settings → Variables & Secrets):
//   - unset or "true"  -> site is live (default)
//   - "false" / "off" / "0" -> whole site (including /admin and the API) returns
//     a "This site can't be reached" (404) page (DOWN_HTML below).
// Kept in Cloudflare infra, independent of the app's own D1/admin, so it works
// even if the database is unavailable. See docs/guides/DEPLOYING.md.
function siteDisabled(env) {
  const v = String(env.SITE_ENABLED ?? 'true').trim().toLowerCase();
  return v === 'false' || v === 'off' || v === '0' || v === 'no';
}

// The "down" page shown when the kill switch is on — a replica of the
// browser's "This site can't be reached" screen. The notfoundicon
// (public/assets/notfoundicon.png) is embedded inline as a data URI because
// when the site is down, an /assets/* request would hit the kill switch too.
const NOTFOUND_ICON = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABIAQMAAABvIyEEAAAABlBMVEUAAABTU1OoaSf/AAAAAXRSTlMAQObYZgAAAENJREFUeF7tzbEJACEQRNGBLeAasBCza2lLEGx0CxFGG9hBMDDxRy/72O9FMnIFapGylsu1fgoBdkXfUHLrQgdfrlJN1BdYBjQQm3UAAAAASUVORK5CYII=';

const DOWN_HTML = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>This site can't be reached</title>
<style>
  html,body { height:100%; }
  body { margin:0; background:#202124; color:#9aa0a6;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    display:flex; align-items:flex-start; justify-content:center; }
  .wrap { max-width:600px; width:100%; padding:100px 24px 24px; }
  img.icon { width:72px; height:72px; opacity:0.65; margin-bottom:34px; image-rendering:pixelated; }
  h1 { font-size:24px; font-weight:400; color:#e8eaed; margin:0 0 18px; }
  p { font-size:15px; line-height:1.6; margin:0 0 18px; color:#9aa0a6; }
  p strong { color:#e8eaed; font-weight:500; }
  .code { font-size:12px; letter-spacing:0.5px; color:#9aa0a6; text-transform:uppercase; }
  .reload { position:fixed; right:24px; bottom:24px;
    background:#8ab4f8; color:#202124; border:0; border-radius:16px;
    padding:9px 20px; font-family:inherit; font-size:14px; font-weight:500; cursor:pointer; }
  .reload:hover { background:#aecbfa; }
</style></head>
<body>
  <div class="wrap">
    <img class="icon" src="${NOTFOUND_ICON}" alt="" />
    <h1>This site can\u2019t be reached</h1>
    <p><strong>legal-connections.com</strong>\u2019s DNS address could not be found. Diagnosing the problem.</p>
    <p class="code">DNS_PROBE_POSSIBLE</p>
  </div>
  <button class="reload" onclick="location.reload()">Reload</button>
</body></html>`;

function maintenanceResponse(pathname) {
  // Everything gets the "site can't be reached" page (404). API callers get a
  // matching JSON 404 so they don't try to parse HTML.
  if (pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({ ok: false, errors: ['Not found'] }), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    });
  }
  return new Response(DOWN_HTML, { status: 404, headers: { 'content-type': 'text/html; charset=utf-8' } });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Kill switch first — nothing else runs when the site is turned off.
    if (siteDisabled(env)) return maintenanceResponse(url.pathname);

    if (url.pathname.startsWith('/api/')) {
      for (const route of ROUTES) {
        if (route.method !== request.method) continue;
        const match = url.pathname.match(route.pattern);
        if (match) return route.handler(request, env, match);
      }
      return json({ ok: false, errors: ['Not found'] }, { status: 404 });
    }

    return env.ASSETS.fetch(request);
  },
};
