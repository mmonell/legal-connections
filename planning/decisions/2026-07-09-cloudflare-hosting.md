# 2026-07-09 — Hosting: Cloudflare Pages + Functions + D1

## Decision

Host the app on Cloudflare Pages (static frontend + Functions for the API),
with Cloudflare D1 as the database, replacing the Express server + JSON file
store from the 2026-07-06 decision. Migrate now, ahead of planned marketing
campaigns, rather than after launch.

## Why

* Marketing campaigns mean bursty, unpredictable incoming traffic. A
  fixed-size single server (e.g. AWS Lightsail) is either under-provisioned
  during a campaign spike or paid-for-but-idle the rest of the time; Cloudflare's
  edge network scales with traffic automatically at no extra cost at this
  app's volume.
* Cost comparison at expected scale: Cloudflare Pages/Functions/D1 free tier
  (Functions: 100k requests/day; D1: 5GB storage + 5M reads/day) comfortably
  covers this app — even 100k leads (~54MB as JSON, likely 15–25MB as real
  database rows) is a small fraction of the D1 free tier. Lightsail's cheapest
  tier is $3.50–5/mo fixed, doesn't auto-scale, and needs manual process
  management (pm2/systemd) plus your own patching.
* Zero-downtime deploys are a first-class feature of Cloudflare Pages (every
  deploy is a new build, atomically swapped in) — see `docs/guides/DEPLOYING.md`.
  The old model (stop/restart a single Node process) has a real, if brief,
  interruption window on every deploy.
* This finally completes the "migrate to PostgreSQL when lead volume or
  querying needs grow" note from the 2026-07-06 decision — D1 is SQL
  (SQLite), which is a bigger structural upgrade from the JSON file than
  Postgres would have been, while requiring no server to run.

## Consequences

* The backend moved from a single Express app (`src/server/`) to Cloudflare
  Pages Functions (`src/functions/`, one file per route, file-based routing).
  This was a full rewrite of the request handlers, not a lift-and-shift —
  see the diff history around this date for the route-by-route port.
* Admin sessions and one-time login codes moved from in-memory `Map`s to D1
  tables (`admin_sessions`, `admin_login_codes`), because Workers have no
  shared memory across requests/isolates the way a single long-running Node
  process did.
* The per-IP rate limiter moved from an in-memory `Map` to a D1 table
  (`rate_limit_hits`) for the same reason.
* Local dev now requires Node 22+ (Wrangler's requirement) and `wrangler
  pages dev` instead of `node --watch server/index.js`. The deployed app
  itself runs on Cloudflare's Workers runtime regardless of local Node
  version — this requirement only affects the local CLI tooling.
* D1 schema changes must be additive-only from here on (no renaming/dropping
  columns a live deployment still reads) so that Cloudflare's zero-downtime
  deploys stay safe when the schema and the code both change together — see
  `docs/guides/DEPLOYING.md`.
* Docker (`ops/deploy/Dockerfile`, `docker-compose.yml`) and the JSON-file
  backup runbook (`ops/scripts/backup-leads.sh`) are no longer applicable and
  were removed; Cloudflare Pages has no Docker step, and D1 has its own
  export tooling instead of copying a file.
* The 34 development-era leads that lived in `src/data/leads.json` were
  preserved as `src/migrations/seed_dev_leads.sql` (not auto-applied — see
  that file's header) rather than discarded.
* Verified locally end-to-end with `wrangler pages dev` on Node 22: all
  routes (static pages, POST/PATCH leads, admin auth request/verify/me,
  admin leads list, rate limiting) work against a migrated local D1
  database. One real gotcha found during this verification: passing
  `--d1 DB=legal-connections` to `wrangler pages dev` makes it resolve a
  *different* local database file than `wrangler d1 migrations apply
  --local` writes to (silent `no such table` errors even right after
  migrating) — Pages auto-detects the D1 binding from `wrangler.toml` on its
  own, so that flag must be omitted. Documented in `docs/guides/RUNNING.md`.
