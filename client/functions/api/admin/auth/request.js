import { requestCode } from '../../../_shared/adminAuth.js';
import { sendLoginEmail } from '../../../_shared/mailer.js';
import { clientIp, json, rateLimited } from '../../../_shared/rateLimit.js';

export async function onRequestPost({ request, env }) {
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
