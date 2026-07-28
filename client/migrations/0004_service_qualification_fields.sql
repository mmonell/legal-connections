-- Additive-only (see docs/guides/DEPLOYING.md): new nullable columns for the
-- per-service qualifying questions (personal injury, workers' comp,
-- immigration), used by scoreLeadForService in src/shared/leadScore.js.
-- Auto-accident fields already exist from migrations 0002/0003.

ALTER TABLE leads ADD COLUMN injured_at_work TEXT;         -- workers-comp: 'yes' | 'no'
ALTER TABLE leads ADD COLUMN reported_to_employer TEXT;    -- workers-comp: 'yes' | 'no' | 'not-sure'
ALTER TABLE leads ADD COLUMN lost_wages TEXT;              -- workers-comp: 'yes' | 'no'
ALTER TABLE leads ADD COLUMN has_evidence TEXT;            -- personal-injury: 'yes' | 'no'
ALTER TABLE leads ADD COLUMN immigration_case_type TEXT;   -- immigration: asylum | family | work-visa | deportation-defense | citizenship | other
ALTER TABLE leads ADD COLUMN has_deadline TEXT;            -- immigration: 'yes' | 'no' | 'not-sure'
ALTER TABLE leads ADD COLUMN in_us TEXT;                   -- immigration: 'yes' | 'no'
