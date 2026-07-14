# Deploying (Cloudflare Pages)

Audience: anyone updating a page or feature and needing to get it live —
assumes no prior Cloudflare experience.

## Why deploys don't interrupt live traffic

This matters especially during marketing campaigns, when the site has real
incoming traffic and there's no good time for a maintenance window.

Every deploy to Cloudflare Pages is a **new, fully separate build** — it does
not patch the running site in place. Cloudflare builds the updated code,
uploads it to its global edge network, and only then atomically flips the
production URL to point at the new deployment. Concretely:

* A visitor mid-session on the old version keeps being served the old version
  until their current request finishes. The very next request (even a second
  later) gets the new version. There is no half-updated state, no restart
  window, and no dropped connections.
* This is fundamentally different from the old Express-on-a-single-server
  model, where "deploying" meant stopping and restarting one Node process —
  which *does* have a brief gap where the server isn't answering requests.
* Every previous deployment stays available at its own URL. Rolling back is
  just re-promoting an older deployment in the Cloudflare dashboard — instant,
  no rebuild, no downtime for the rollback either.

## Folder structure: /test vs /client

This repo separates the dev working copy from the production copy Cloudflare
actually deploys:

* **`/test`** — where you make changes and run `npm run dev`. Treat this as
  the only place you hand-edit code.
* **`/client`** — a generated copy of `/test`, promoted by
  `ops/scripts/sync-to-client.sh`. This is the folder connected to Cloudflare
  Pages and the only one that should ever be pushed to `main`. Don't hand-edit
  files in `/client` — the next sync will overwrite them.

Promote a change:

```bash
ops/scripts/sync-to-client.sh          # copies test/ -> client/
ops/scripts/sync-to-client.sh --dry-run  # preview what would change first
```

The script excludes `node_modules/`, `.wrangler/`, `.env*`, and `*.test.js`
so `/client` only ever contains what needs to ship.

## One-time setup

1. Push this repo to GitHub (if not already).
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**, select this repo.
3. Build settings:
   * Build command: (none — this project has no build step)
   * Build output directory: `client/public`
   * Root directory: `client` (so Cloudflare finds `wrangler.toml` and `functions/`)
4. Create the D1 database once: `wrangler d1 create legal-connections`, then copy the returned `database_id` into `test/wrangler.toml` (and re-run the sync script so `client/wrangler.toml` picks it up).
5. Apply the schema to the remote database: `cd client && npm run db:migrate:remote`.
6. Set secrets (never commit these): `wrangler pages secret put AWS_SES_KEY`, `wrangler pages secret put AWS_SES_SECRET`, `wrangler pages secret put AWS_REGION`, `wrangler pages secret put CONTACT_SENDER_EMAIL` (defaults to `do-not-reply@legal-connections.com` if unset), `wrangler pages secret put CONTACT_EMAIL` — see `test/.env.example`.
7. Point your domain's DNS at the Pages project (Cloudflare walks you through this in the project's **Custom domains** tab).

After this, every `git push` to `main` deploys automatically from `/client`.
Nothing below this point needs to happen again per-deploy.

## Day-to-day workflow

1. **Make the change.** Edit components/pages under `test/public/`, or routes under `test/functions/`. Run `npm run dev` inside `test/` to check it locally.
2. **Promote to client.** Run `ops/scripts/sync-to-client.sh` to copy your verified changes from `/test` into `/client`.
3. **For anything risky** (new copy, a new question in the avatar flow, pricing/service changes): push `/client` to a branch or open a PR first. Cloudflare automatically builds a **preview URL** for every branch — check it live before it ever touches production. No extra config needed; this is automatic once step 2 of setup is done.
4. **Merge to `main`.** Production rebuilds and deploys in the background (usually under a minute for this project — no build step, mostly static files). Live traffic is never interrupted (see above).
5. **If something's wrong:** open the Cloudflare Pages dashboard → Deployments → find the last good one → **Rollback to this deployment**. Instant, no rebuild.

## Database migrations (the one place that needs care)

Schema changes are **not** part of the zero-downtime deploy story
automatically — they need one rule followed to stay safe:

> **Migrations must be additive only.** Add new nullable columns or new
> tables. Never rename or drop a column that the *currently deployed* code
> still reads or writes.

Why: during a rollout, the old Function code and the new Function code can
both be executing against the same D1 database for a short window (some
requests still routed to the previous deployment while the new one spins up).
If a migration renamed a column the old code expects, those in-flight
requests would start failing. Additive changes are safe in both directions —
old code ignores new columns it doesn't know about, new code can still read
old data since existing columns didn't move.

Workflow:

```bash
# 1. Add a new file: test/migrations/0002_your_change.sql
#    (e.g. ALTER TABLE leads ADD COLUMN referral_source TEXT;)

# 2. Test it locally first
cd test
npm run db:migrate:local

# 3. Promote to client, then apply to production
ops/scripts/sync-to-client.sh
cd client
npm run db:migrate:remote

# 4. Then deploy the code that uses the new column (push client/ to main as usual)
```

Apply the migration *before* the code that depends on it goes live — that
ordering means the column already exists by the time the new Function code
that reads/writes it starts receiving traffic.

If you ever do need a breaking schema change (a real rename, a drop), do it
in two deploys: first ship code that writes to both the old and new column,
run the migration, backfill, then ship the code that only uses the new
column, then finally drop the old one in a later migration.

## Rate limits and free-tier ceilings

Cloudflare's free tier (Pages, Functions, D1) comfortably covers this app at
realistic marketing-campaign traffic — see
`planning/decisions/2026-07-09-cloudflare-hosting.md` for the numbers this
was checked against. If a campaign is expected to be unusually large, check
current Cloudflare Workers/D1 free-tier limits before the campaign starts,
since Cloudflare's published limits can change.
