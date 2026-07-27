-- Additive-only (see docs/guides/DEPLOYING.md). Tracks whether the
-- HOT/WARM/COLD notification email has been sent for a lead, so progressive
-- avatar-intake PATCHes don't re-send it on every answer.

ALTER TABLE leads ADD COLUMN qualification_emailed_at TEXT;
