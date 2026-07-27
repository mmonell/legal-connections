// Login email delivery.
//
// Production: AWS SES. The 6-digit code goes in the SUBJECT line on purpose:
// the recipient can read it straight from the notification preview on their
// device without opening the mail app.
//
// Dev bypass: until SES is configured (AWS_SES_KEY/AWS_SES_SECRET/AWS_REGION
// secrets set via `wrangler secret put`), no email is sent; the caller
// receives the code back and the admin page shows it on screen.
//
// Default sender if CONTACT_SENDER_EMAIL isn't set: do-not-reply@legal-connections.com
// (see .env.example and docs/guides/DEPLOYING.md).
const DEFAULT_SENDER_EMAIL = 'do-not-reply@legal-connections.com';

export async function sendLoginEmail(env, { to, code, link }) {
  const from = env.CONTACT_SENDER_EMAIL || DEFAULT_SENDER_EMAIL;
  const subject = `${code} is your Legal Connections sign-in code`;
  const body = [
    `Your sign-in code is ${code}. It expires in 15 minutes.`,
    '',
    `Or sign in with one tap: ${link}`,
    '',
    'If you did not request this, you can ignore this email.',
  ].join('\n');

  if (!env.AWS_SES_KEY || !env.AWS_SES_SECRET || !env.AWS_REGION) {
    console.log(`[mailer] SES not configured; dev bypass for ${to}. Subject: "${subject}"`);
    return { sent: false, devBypass: true };
  }

  // TODO(launch): send via AWS SES (SESv2 SendEmail, called over HTTPS with a
  // SigV4-signed request since the AWS SDK doesn't run in the Workers
  // runtime) using env.AWS_SES_KEY/AWS_SES_SECRET/AWS_REGION to sign, and
  // `from` as sender. Keep `subject` exactly as built above so the code
  // shows in notification previews.
  console.log(`[mailer] TODO SES send to ${to} from ${from}: "${subject}"\n${body}`);
  return { sent: true };
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
  const from = env.CONTACT_SENDER_EMAIL || DEFAULT_SENDER_EMAIL;
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

  if (!env.AWS_SES_KEY || !env.AWS_SES_SECRET || !env.AWS_REGION) {
    console.log(`[mailer] SES not configured; dev bypass for lead notification to ${to}. Subject: "${subject}"\n${body}`);
    return { sent: false, devBypass: true };
  }

  // TODO(launch): send via AWS SES, same as sendLoginEmail above.
  console.log(`[mailer] TODO SES send to ${to} from ${from}: "${subject}"\n${body}`);
  return { sent: true };
}
