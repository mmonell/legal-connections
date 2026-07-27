// Email delivery via AWS SES (SESv2 SendEmail), called over HTTPS with a
// SigV4-signed request — the AWS SDK doesn't run in the Workers runtime, so
// requests are signed by hand using Web Crypto (crypto.subtle), which is
// available in Workers.
//
// Dev bypass: until SES is configured (AWS_SES_KEY/AWS_SES_SECRET/AWS_REGION
// secrets set via `wrangler secret put`), no email is sent; callers get
// { devBypass: true } back so the caller can surface the info another way
// (e.g. the admin page shows the login code on screen instead of emailing it).
//
// Default sender if CONTACT_SENDER_EMAIL isn't set: do-not-reply@legal-connections.com
// (see .env.example and docs/guides/DEPLOYING.md).
const DEFAULT_SENDER_EMAIL = 'do-not-reply@legal-connections.com';

async function hmac(key, message) {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    typeof key === 'string' ? new TextEncoder().encode(key) : key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message));
}

function toHex(buffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(message) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(message));
  return toHex(digest);
}

// AWS Signature Version 4 for a JSON POST request to a regional AWS service
// endpoint. See: https://docs.aws.amazon.com/general/latest/gr/sigv4-signing.html
async function signRequest({ accessKeyId, secretAccessKey, region, service, host, path, body }) {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, ''); // YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.slice(0, 8); // YYYYMMDD

  const canonicalHeaders = `content-type:application/json\nhost:${host}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = 'content-type;host;x-amz-date';
  const payloadHash = await sha256Hex(body);
  const canonicalRequest = [
    'POST',
    path,
    '',
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    await sha256Hex(canonicalRequest),
  ].join('\n');

  const kDate = await hmac(`AWS4${secretAccessKey}`, dateStamp);
  const kRegion = await hmac(kDate, region);
  const kService = await hmac(kRegion, service);
  const kSigning = await hmac(kService, 'aws4_request');
  const signature = toHex(await hmac(kSigning, stringToSign));

  const authorization = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return { amzDate, authorization };
}

// Low-level SESv2 SendEmail call. Throws on a non-2xx response so callers can
// decide how to handle a failed send.
async function sesSendEmail(env, { to, from, subject, body }) {
  const region = env.AWS_REGION;
  const host = `email.${region}.amazonaws.com`;
  const path = '/v2/email/outbound-emails';
  const requestBody = JSON.stringify({
    FromEmailAddress: from,
    Destination: { ToAddresses: [to] },
    Content: {
      Simple: {
        Subject: { Data: subject, Charset: 'UTF-8' },
        Body: { Text: { Data: body, Charset: 'UTF-8' } },
      },
    },
  });

  const { amzDate, authorization } = await signRequest({
    accessKeyId: env.AWS_SES_KEY,
    secretAccessKey: env.AWS_SES_SECRET,
    region,
    service: 'ses',
    host,
    path,
    body: requestBody,
  });

  const res = await fetch(`https://${host}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Host: host,
      'X-Amz-Date': amzDate,
      Authorization: authorization,
    },
    body: requestBody,
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`SES send failed (${res.status}): ${errText}`);
  }
}

// Sends via SES if configured, otherwise logs and reports a dev bypass so
// callers can fall back to an on-screen/no-op behavior. Never throws — a
// failed send is logged and reported as { sent: false }, since login/lead
// flows must keep working even if outbound email is temporarily down.
async function send(env, { to, subject, body }) {
  const from = env.CONTACT_SENDER_EMAIL || DEFAULT_SENDER_EMAIL;

  if (!env.AWS_SES_KEY || !env.AWS_SES_SECRET || !env.AWS_REGION) {
    console.log(`[mailer] SES not configured; dev bypass for ${to}. Subject: "${subject}"\n${body}`);
    return { sent: false, devBypass: true };
  }

  try {
    await sesSendEmail(env, { to, from, subject, body });
    return { sent: true };
  } catch (err) {
    console.error('[mailer] SES send failed:', err);
    return { sent: false, error: true };
  }
}

// Login email delivery. The 6-digit code goes in the SUBJECT line on
// purpose: the recipient can read it straight from the notification preview
// on their device without opening the mail app.
export async function sendLoginEmail(env, { to, code, link }) {
  const subject = `${code} is your Legal Connections sign-in code`;
  const body = [
    `Your sign-in code is ${code}. It expires in 15 minutes.`,
    '',
    `Or sign in with one tap: ${link}`,
    '',
    'If you did not request this, you can ignore this email.',
  ].join('\n');
  return send(env, { to, subject, body });
}

// New-lead notification, sent right after a lead is created. Subject carries
// the HOT/WARM/COLD qualification so the team can triage from the inbox
// preview alone, per FORMATO DE CALIFICACIÓN DE LEAD — LEGAL CONNECTIONS.
//
// Recipient: CONTACT_EMAIL (the real intake inbox once set). While testing —
// CONTACT_EMAIL unset — falls back to the default sender address
// (do-not-reply@legal-connections.com) so the flow is exercisable end-to-end
// before a real inbox is configured.
export async function sendLeadQualificationEmail(env, { lead, score, qualification, reasons }) {
  const to = env.CONTACT_EMAIL || DEFAULT_SENDER_EMAIL;
  const label = qualification.toUpperCase();
  const subject = `NEW ${label} LEAD`;
  const body = [
    `Qualification: ${label} (${score} points)`,
    '',
    'Why:',
    ...reasons.map((r) => `- ${r}`),
    '',
    'Lead details:',
    `Name: ${lead.name || '-'}`,
    `Phone: ${lead.phone || '-'}`,
    `Email: ${lead.email || '-'}`,
    `Source: ${lead.source || '-'}`,
    `Case type: ${lead.caseType || '-'}`,
    `State of residence: ${lead.stateOfResidence || '-'}`,
    `Accident state/city: ${lead.accidentState || '-'} / ${lead.city || '-'}`,
    `Accident date: ${lead.accidentDate || '-'}`,
    `Injured / medical treatment: ${lead.injured || '-'} / ${lead.medicalTreatment || '-'}`,
    `Vehicle damage: ${lead.vehicleDamage || '-'}`,
    `Police report / photos: ${lead.policeResponded || '-'} / ${lead.hasPhotos || '-'}`,
    `Fault belief: ${lead.faultBelief || '-'}`,
    `Has attorney already: ${lead.hasAttorney || '-'}`,
    `Preferred language: ${lead.preferredLanguage || lead.language || '-'}`,
    `Description: ${lead.description || '-'}`,
  ].join('\n');
  return send(env, { to, subject, body });
}
