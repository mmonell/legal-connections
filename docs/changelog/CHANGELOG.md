# Changelog

## 2026-07-09 — Cloudflare hosting migration (v0.4.0)

* Backend rewritten from a single Express server (`src/server/`) to Cloudflare Pages Functions (`src/functions/`, file-based routing, one file per route) — see `planning/decisions/2026-07-09-cloudflare-hosting.md` for why.
* Lead storage, admin users, admin sessions, one-time login codes, and the per-IP rate limiter all moved from JSON files / in-memory `Map`s to Cloudflare D1 (`src/migrations/0001_init.sql`). The 34 development-era leads were preserved as `src/migrations/seed_dev_leads.sql`.
* All `/api/leads`, `/api/leads/:id` (PATCH), and `/api/admin/*` routes ported with the same request/response shapes — see `docs/api/leads.md` (fully rewritten to match).
* Docker deploy files and the JSON-file backup runbook removed (no longer applicable); replaced by the Cloudflare deploy workflow documented in `docs/guides/DEPLOYING.md`.
* Local dev now uses `wrangler pages dev` and requires Node 22+ (`docs/guides/RUNNING.md`).

## 2026-07-06 — Brand palette + hero form (v0.2.0)

* CTA color switched from placeholder amber to Brand Kit **Signature Orange #E66A2C**; emerald palette added as CSS tokens (`--lc-emerald-deep/-emerald/-emerald-mid`, `--lc-offwhite`).
* Hero rebuilt as a two-column banner: pitch on the left, case evaluation form on the right (First/Last Name, Phone, Zip, E-mail, Case Type, description, consent legalese, "See if you qualify") — forthepeople.com pattern.
* Standalone lead-form section removed; `#evaluation` anchor now points to the hero form. Lead API stores new `zip` and `caseType` fields.
* Hero reference export: `planning/reference/hero-banner.png` (regenerate via `src/public/hero-preview.html` + headless Chrome).

## 2026-07-06 — Initial release (v0.1.0)

* Workspace scaffolded per `Claude/claude-workspace-setup.md` (CLAUDE.md + planning/src/docs/ops).
* Bilingual (EN/ES) homepage: hero CTA banner (forthepeople.com pattern), how-it-works, services, why-us, team, free case evaluation form, footer with referral-network disclaimer.
* White-labeled WhatsApp chat widget (dolmanlaw.com pattern) with topic quick-replies and `wa.me` handoff.
* Express server: static hosting, `POST /api/leads` with validation + per-IP rate limiting, JSON file lead store, `node --test` suite.
* Docker deploy files in `/ops/deploy`.
* Placeholder contact numbers marked `TODO` in `src/public/config.js`.
