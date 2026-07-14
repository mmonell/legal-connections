# 2026-07-06 — Stack and lead storage

> **Superseded 2026-07-09** — see `2026-07-09-cloudflare-hosting.md`. The
> Node.js 20 + Express + JSON-file-store backend described below was replaced
> by Cloudflare Pages Functions + D1 ahead of planned marketing campaigns.
> The frontend decisions here (native Web Components, no build step) are
> unaffected and still current.

## Decision

Follow the workspace reference stack (`Claude/Workspace Setup/test`): native Web Components with no build step, Node.js 20 + Express. Store leads in an append-only JSON file (`src/data/leads.json`) instead of PostgreSQL for the MVP.

## Why

* Matches the established Legal Connections workspace pattern; zero build tooling to maintain.
* The MVP's only write path is lead submissions (low volume); a JSON file keeps local setup to `npm install && npm run dev` with a single dependency (express).
* Docker deploy stays trivial.

## Consequences

* Migrate to PostgreSQL when lead volume or querying needs grow; the storage layer is isolated in `src/server/leadStore.js` so the swap touches one file.
* `src/data/` must be a mounted volume in production so leads survive redeploys.
