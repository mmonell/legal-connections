# Planning Workspace

## The App

Legal Connections webapp — a bilingual (EN/ES) lead-generation site for car accident injury referrals. Visitors describe their accident through a free case evaluation form or a white-labeled WhatsApp chat; Legal Connections routes them to trusted attorneys and medical providers.

## Company

Legal Connections — "Connected by Trust". Services: Auto Accidents (primary focus of this app), Personal Injury, Immigration, Workers' Compensation, Medical Network, Legal Referrals. Team: Eric Nieves (Founder), Allam Quintero (Marketing Strategy), Jorge Lugo (Creative/Brand), Alondra Modesto (Marketing & face of brand). Audience is heavily Spanish-speaking — every feature ships in both languages.

**Important:** Legal Connections is a referral network, not a law firm. All public copy must carry the disclaimer and never promise legal outcomes.

## Tech Stack

Native Web Components + ES Modules (no build step), Cloudflare Pages Functions for the backend, Cloudflare D1 for lead storage. Code is edited in `/test`, promoted to `/client` via `ops/scripts/sync-to-client.sh`, then deployed push-to-`main` via Cloudflare Pages from `/client` — see `docs/guides/DEPLOYING.md` and `planning/decisions/2026-07-09-cloudflare-hosting.md`.

## Current Priorities

1. Homepage with hero CTA banner modeled on forthepeople.com (free case evaluation)
2. White-labeled WhatsApp live chat modeled on dolmanlaw.com
3. Lead capture API + storage
4. Replace placeholder phone/WhatsApp numbers with real ones (see `test/public/config.js`)

## Architectural Principles

* No frontend framework, no build step — the browser runs what we write.
* Components are self-contained: markup, styles, and strings (EN + ES) live in the component file.
* One source of truth for contact info: `config.js`.
* Keep the backend thin: one Pages Function per route, shared logic in `functions/_shared/`.
* D1 migrations are additive-only (never rename/drop a column live code still reads) so deploys stay zero-downtime — see `docs/guides/DEPLOYING.md`.
