# Running the Webapp

## Requirements

* Node.js 22+ (required by Wrangler, the Cloudflare CLI — the deployed app itself runs on Cloudflare's Workers runtime, not your local Node version)
* If you're on Node 20 for other projects, use nvm: `nvm install 22 && nvm use 22` inside this project

## Development

```bash
cd test
npm install
npm run db:migrate:local   # first time only (or after a new migration): sets up the local D1 database
npm run dev                # http://localhost:8788 by default — serves public/ + functions/ together
```

`npm run dev` runs `wrangler pages dev`, which serves the static site and the
API Functions from one local server, backed by a local SQLite copy of the D1
schema (no network calls to Cloudflare needed for local dev).

**Do not add a `--d1 DB=legal-connections` flag to the dev command.** It's
tempting (it's how Workers projects usually bind D1 locally), but for Pages
projects it makes Wrangler resolve a *different* local database file than
`wrangler d1 migrations apply --local` writes to — you'll get `no such table`
errors even right after migrating. Pages auto-detects the `[[d1_databases]]`
binding from `wrangler.toml` on its own; leave the flag off.

## Tests

```bash
cd test
npm test
```

Tests cover the pure logic in `functions/_shared/` (validation, sanitization,
row mapping) with `node --test` — no D1 or network connection required to run
them.

## Promoting changes to production

All edits above happen inside `/test`. Cloudflare Pages deploys from
`/client`, a generated copy — run `ops/scripts/sync-to-client.sh` to promote
your changes, then push `/client` per `docs/guides/DEPLOYING.md`.

## Before Launch Checklist

1. Replace every `TODO` value in `test/public/config.js` (phone, WhatsApp number, email) — WhatsApp number must be digits only with country code (e.g. `17875551234`).
2. Set the real SES credentials as Cloudflare Pages secrets (`wrangler pages secret put AWS_SES_KEY`, `wrangler pages secret put AWS_SES_SECRET`, `wrangler pages secret put AWS_REGION`, `wrangler pages secret put CONTACT_SENDER_EMAIL`, `wrangler pages secret put CONTACT_EMAIL`) and finish the SES send call in `test/functions/_shared/mailer.js` (currently a logged TODO / dev bypass).
3. Review the footer disclaimer with an attorney.
4. Connect the Cloudflare Pages project to this repo and point your domain's DNS at it (see `docs/guides/DEPLOYING.md`).
5. Replace the seeded admin accounts in `test/migrations/0001_init.sql` (or add more via the Settings page in `/admin`) with the real launch admin list.

## Where Leads Go

Form submissions, the avatar intake, and WhatsApp chat starts are stored in
the D1 `leads` table (see `test/migrations/0001_init.sql`). Each record has an
`id`, `received_at`, `source` (`case-evaluation-form`, `avatar-intake`, or
`whatsapp-chat`), contact fields, guided-intake answers, and the visitor's
language. View, export, or delete them at `/admin` (passwordless sign-in —
see `test/CONTEXT.md`).
