-- Additive-only (see docs/guides/DEPLOYING.md): new nullable columns for the
-- lead qualification questions from FORMATO DE CALIFICACIÓN DE LEAD, used to
-- compute the HOT/WARM/COLD score (src/shared/leadScore.js) sent in the new
-- lead notification email.

ALTER TABLE leads ADD COLUMN state_of_residence TEXT;
ALTER TABLE leads ADD COLUMN accident_state TEXT;
ALTER TABLE leads ADD COLUMN vehicle_damage TEXT; -- 'yes' | 'no'
ALTER TABLE leads ADD COLUMN has_photos TEXT; -- 'yes' | 'no'
ALTER TABLE leads ADD COLUMN medical_treatment TEXT; -- 'yes' | 'no'
ALTER TABLE leads ADD COLUMN has_attorney TEXT; -- 'yes' | 'no'
ALTER TABLE leads ADD COLUMN accident_role TEXT; -- 'driver' | 'passenger' | 'pedestrian'
ALTER TABLE leads ADD COLUMN qualification TEXT; -- 'hot' | 'warm' | 'cold', computed server-side on create
ALTER TABLE leads ADD COLUMN qualification_score INTEGER;
