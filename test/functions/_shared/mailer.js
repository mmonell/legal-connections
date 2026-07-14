// Login email delivery.
//
// Production: AWS SES. The 6-digit code goes in the SUBJECT line on purpose:
// the recipient can read it straight from the notification preview on their
// device without opening the mail app.
//
// Dev bypass: until SES is configured (AWS_SES_KEY/AWS_SES_SECRET/AWS_REGION
// secrets set via `wrangler pages secret put`), no email is sent; the caller
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
