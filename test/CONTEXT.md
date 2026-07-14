# Test Workspace (dev working copy)

This is the dev working copy — all hand-edits happen here. Cloudflare Pages
deploys from `/client`, a generated copy of this folder (`ops/scripts/sync-to-client.sh`
promotes changes); never edit `/client` directly.

The homepage combines a conversational guided intake with a classic marketing
page, rather than choosing one or the other (spec:
`/planning/specs/guided-intake-concept_spec.md`). Right under the header,
emerald sprites gather into the "LEGAL CONNECTIONS" wordmark, greet the
visitor, and ask one question at a time in captions: accident yes/no, what
happened, when (dropdown, up to 14 days ago), injured, police, fault,
insurance. It gives personalized guidance BEFORE asking for contact info, then
collects name/phone/email (all required) and preferred language. The sprites
toggle wordmark <-> orb on every answer. Each answer is saved as it arrives
(POST creates the lead, PATCH updates it, `source: 'avatar-intake'`). Below
the marketing sections (How It Works, Services, Why Us, Team), the page also
keeps the classic static case-evaluation form (`lc-hero`) as a second,
form-based way to convert.

## Pages

* `/` — header, `lc-avatar` guided intake banner, marketing sections, classic
  `lc-hero` form, footer, WhatsApp button (bottom-right)
* `/landing` — the original all-marketing homepage, kept as a template:
  duplicate `landing.html` whenever a promotions/marketing landing page is
  needed that shouldn't include the guided intake
* `/services/<slug>` — five service pages (`lc-service-page`): each embeds
  `lc-avatar` pre-seeded to that service's case type (via the `case`
  attribute) plus the "How We Help" SEO content and the `lc-hero` form
  (also pre-seeded via its `service` attribute)
* `/admin` — internal leads viewer (table, CSV/XLSX/JSON export, delete) with
  passwordless sign-in: an emailed 6-digit code + magic link (the code rides in
  the email SUBJECT so it is readable from the notification preview). Email
  goes out via AWS SES (`functions/_shared/mailer.js`, TODO: wire real SES
  sending — see that file); until SES is configured, a dev bypass shows the
  code on the page. Users + roles live in the D1 `admin_users` table
  (superadmin: view/download/delete/manage users; admin: same minus delete;
  user: view/download). The Settings section in /admin creates users.
  English-only internal tool.

## Structure

* `public/` — everything the browser loads, served statically by Cloudflare
  Pages (this directory is `pages_build_output_dir` in `wrangler.toml`)
  * `index.html`, `landing.html`, `admin.html`, `services/*.html` — pages
  * `global.css` — design tokens + shared styles (only global stylesheet)
  * `config.js` — contact info, WhatsApp number, brand constants (edit here, nowhere else)
  * `i18n.js` — language state (EN/ES), `t()` helper, `lc-lang-change` event
  * `components/` — native Web Components, one per file, tag = filename
* `functions/` — Cloudflare Pages Functions (the backend). File-based routing:
  `functions/api/leads/index.js` handles `/api/leads`, `[id].js` files handle
  `/api/leads/:id`-style dynamic segments. Each file exports
  `onRequestGet`/`onRequestPost`/etc. per HTTP method.
  * `_shared/` — helpers used by multiple routes: `leads.js` (sanitize/
    validate/row-mapping), `adminAuth.js` (sessions, login codes, permission
    checks), `mailer.js` (SES email), `rateLimit.js` (D1-backed per-IP limit)
  * `api/leads/`, `api/health.js` — public lead-capture endpoints
  * `api/admin/` — auth (request/verify/signout), `me.js`, `leads/`
    (list/delete), `users/` (list/create) — every route here calls
    `requirePermission()` from `_shared/adminAuth.js` first
* `migrations/` — D1 schema. `0001_init.sql` is the baseline schema (leads,
  admin_users, admin_sessions, admin_login_codes, rate_limit_hits) plus the
  two seed admin accounts. `seed_dev_leads.sql` is optional dev-only sample
  data, never auto-applied. New migrations must be additive only — see
  `docs/guides/DEPLOYING.md`.
* `wrangler.toml` — Cloudflare Pages project config (D1 binding name `DB`,
  compatibility date). Secrets (SES credentials) are set via
  `wrangler pages secret put`, never committed.

## Local development

Requires Node 22+ (Wrangler's requirement — separate from what the deployed
Functions run under, which is Cloudflare's own Workers runtime regardless of
your local Node version):

```
nvm install 22 && nvm use 22
cd test
npm install
npm run db:migrate:local   # applies migrations/*.sql to a local D1 sqlite file
npm run dev                # wrangler pages dev — serves public/ + functions/
```

See `docs/guides/RUNNING.md` for the full walkthrough and
`docs/guides/DEPLOYING.md` for how a change goes from local to production.

## Conventions

* Components: `lc-` tag prefix, file `lc-hero.js` → `<lc-hero>`. Class name PascalCase.
* Every component keeps its own `strings = { en: {...}, es: {...} }` and re-renders on the `lc-lang-change` document event.
* Styles: design tokens (colors, spacing, fonts) come from `global.css` CSS variables; component-scoped rules go in a `<style>` block inside the component's `innerHTML`. No Shadow DOM (keeps global tokens simple).
* No frameworks, no npm packages on the frontend, no build step.
* Backend: one file per route under `functions/`, shared logic in `functions/_shared/`. Validate every API input server-side; never trust the form. D1 queries always use `.bind()` parameters — never string-interpolate user input into SQL.
* Tests: `feature-name.test.js` next to the code it covers, run with `node --test`.

## Patterns to Avoid

* Hardcoding phone/WhatsApp numbers in components — always read `config.js`.
* English-only strings — every user-facing string ships EN + ES.
* Promising legal outcomes in copy — we are a referral network, not a law firm.
* Non-additive D1 migrations (renaming/dropping a column a live deployment still reads) — see `docs/guides/DEPLOYING.md` for why this breaks zero-downtime deploys.
* String-building SQL with user input — always parameterize with `.bind()`.
