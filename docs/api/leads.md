# Lead & Admin API

All routes are Cloudflare Pages Functions under `test/functions/api/` (edited
in `/test`, deployed from the promoted `/client` copy) — see
`test/CONTEXT.md` for the file-based routing convention. Every route validates
input server-side and uses D1 parameterized queries (`.bind()`), never
string-interpolated SQL.

## POST /api/leads

Creates a referral lead. Rate limited to 10 requests/minute per IP (D1-backed,
see `functions/_shared/rateLimit.js`).

### Request

```json
{
  "name": "Ana Rivera",
  "phone": "(787) 555-0123",
  "email": "ana@example.com",
  "city": "Orlando",
  "county": "Orange",
  "caseType": "car-accident",
  "preferredLanguage": "es",
  "accidentDate": "2026-06-28",
  "injured": "yes",
  "policeResponded": "yes",
  "faultBelief": "other-driver",
  "spokeWithInsurance": "no",
  "description": "Rear-ended on PR-52, neck pain since.",
  "language": "es",
  "consent": true,
  "source": "case-evaluation-form"
}
```

* `name`, `consent` — required, unless `source` is `"avatar-intake"` or `"whatsapp-chat"` (both build the lead progressively — see PATCH below).
* `phone` — required unless `source` is `"avatar-intake"` or `"whatsapp-chat"`.
* `email`, `city`, `county`, `caseType`, `preferredLanguage`, `accidentDate`, `injured`, `policeResponded`, `faultBelief`, `spokeWithInsurance`, `description` — optional.
* `language` — `"en"` or `"es"`; anything else is stored as `"en"`.
* `source` — `"case-evaluation-form"` (the static `lc-hero` form, default), `"avatar-intake"` (the guided questionnaire), or `"whatsapp-chat"` (WhatsApp button click, logs a no-PII placeholder lead).

### Responses

* `201` — `{ "ok": true, "id": "<uuid>" }`
* `400` — `{ "ok": false, "errors": ["..."] }`
* `429` — rate limited
* `500` — storage failure

## PATCH /api/leads/:id

Updates a lead in place. Used by the guided intake (`lc-avatar`) to save each
answer as the visitor gives it, rather than waiting for a final submit.
Same rate limit as POST.

### Request

Any subset of the same fields as POST (only fields present in the body are
changed — this never blanks out an answer saved earlier). Always sets
`source` to `"avatar-intake"` for validation purposes.

```json
{ "injured": "yes", "policeResponded": "yes" }
```

### Responses

* `200` — `{ "ok": true, "id": "<uuid>" }`
* `400` — `{ "ok": false, "errors": ["Nothing to update"] }` (empty patch) or validation errors
* `404` — lead not found
* `429` / `500` — as above

## GET /api/health

Returns `{ "ok": true }`.

---

## Admin API

Every route below requires a Bearer session token (`Authorization: Bearer
<sid>`, obtained from `/api/admin/auth/verify`) and a matching permission —
see the role matrix in `functions/_shared/adminAuth.js`. All admin routes
return `401` if not signed in, `403` if the session's role lacks the required
permission.

### POST /api/admin/auth/request

Body: `{ "email": "..." }`. Always responds `{ "ok": true, "sent": true }`
whether or not the email belongs to an admin user (so accounts can't be
probed). If the email is a known admin, generates a 6-digit code + magic-link
token, emails them (code in the subject line — see
`functions/_shared/mailer.js`), and stores them in D1 (`admin_login_codes`,
15-minute TTL). Until AWS SES is configured, the response also includes
`devCode`/`devLink` so local/staging testing doesn't require real email.

### POST /api/admin/auth/verify

Body: either `{ "email": "...", "code": "123456" }` or `{ "token": "..." }`
(magic link). On success, creates a session (`admin_sessions`, 12-hour TTL)
and returns `{ "ok": true, "session": "<sid>", "user": { "email", "role" } }`.
Codes are single-use and capped at 5 attempts.

### POST /api/admin/auth/signout

Deletes the session matching the `Authorization` header. Always `{ "ok": true }`.

### GET /api/admin/me

Returns the signed-in user: `{ "ok": true, "user": { "email", "role", "permissions": [...] } }`.

### GET /api/admin/leads

Requires the `view` permission. Returns every lead:
`{ "ok": true, "count": <n>, "leads": [...] }` (same shape as the POST/PATCH
request fields, plus `id`, `receivedAt`, `updatedAt`, `source`).

### DELETE /api/admin/leads/:id

Requires the `delete` permission (superadmin only — `admin` and `user` roles
cannot delete). Returns `{ "ok": true }` or `404` if not found.

### GET /api/admin/users

Requires the `manageUsers` permission. Returns
`{ "ok": true, "users": [{ "email", "role", "createdAt" }, ...] }`.

### POST /api/admin/users

Requires the `manageUsers` permission. Body: `{ "email": "...", "role": "admin" | "user" }`
(new users can only be created as `admin` or `user` — `superadmin` is seeded
via migration, not created through the API). Returns `201` with the created
user, or `400` if the email is invalid/role is wrong/user already exists.
