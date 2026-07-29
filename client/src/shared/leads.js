// Shared lead sanitization/validation, ported from the old server/leadStore.js.
// Column names here are the D1 (snake_case) names; the JSON the browser sends
// is still camelCase, converted at the edges (buildLeadRow/patchRow).

// Sources are granular per page + form so leads can be attributed precisely
// (e.g. "services-auto-accidents-cta"). Rather than enumerate every value, we
// recognize them by shape:
//   - "whatsapp-chat"                    -> WhatsApp button
//   - "<page>-<...>-banner" / "avatar-intake" -> conversational guided intake
//   - "<page>-<...>-cta" / "case-evaluation-form" -> static form
// A "conversational" source (the guided intake / WhatsApp) builds the lead
// progressively, so it relaxes the up-front name/consent/phone requirement.
const LANGUAGES = new Set(['en', 'es', 'pt']);
const SOURCE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/; // lowercase, hyphen-separated
const DEFAULT_SOURCE = 'case-evaluation-form';

function isConversationalSource(source) {
  return source === 'whatsapp-chat' || source === 'avatar-intake' || /(?:^|-)banner$/.test(String(source || ''));
}

// A static-form (CTA) lead arrives complete in one POST and can be qualified
// immediately; conversational sources are qualified later on their final PATCH.
export function isStaticFormSource(source) {
  return source === 'case-evaluation-form' || /(?:^|-)cta$/.test(String(source || ''));
}

function normalizeSource(source) {
  const s = String(source || '').trim().toLowerCase();
  return SOURCE_PATTERN.test(s) && s.length <= 60 ? s : DEFAULT_SOURCE;
}

function sanitizeFields(input) {
  return {
    name: input.name ? String(input.name).trim().slice(0, 200) : null,
    phone: String(input.phone || '').trim().slice(0, 40) || null,
    email: input.email ? String(input.email).trim().slice(0, 200) : null,
    city: input.city ? String(input.city).trim().slice(0, 100) : null,
    county: input.county ? String(input.county).trim().slice(0, 60) : null,
    caseType: input.caseType ? String(input.caseType).trim().slice(0, 60) : null,
    preferredLanguage: LANGUAGES.has(input.preferredLanguage) ? input.preferredLanguage : null,
    accidentDate: input.accidentDate ? String(input.accidentDate).trim().slice(0, 40) : null,
    injured: input.injured ? String(input.injured).trim().slice(0, 20) : null,
    policeResponded: input.policeResponded ? String(input.policeResponded).trim().slice(0, 20) : null,
    faultBelief: input.faultBelief ? String(input.faultBelief).trim().slice(0, 40) : null,
    spokeWithInsurance: input.spokeWithInsurance ? String(input.spokeWithInsurance).trim().slice(0, 20) : null,
    description: input.description ? String(input.description).trim().slice(0, 5000) : null,
    language: LANGUAGES.has(input.language) ? input.language : 'en',
    consent: Boolean(input.consent),
    stateOfResidence: input.stateOfResidence ? String(input.stateOfResidence).trim().slice(0, 60) : null,
    accidentState: input.accidentState ? String(input.accidentState).trim().slice(0, 60) : null,
    vehicleDamage: input.vehicleDamage ? String(input.vehicleDamage).trim().slice(0, 20) : null,
    hasPhotos: input.hasPhotos ? String(input.hasPhotos).trim().slice(0, 20) : null,
    medicalTreatment: input.medicalTreatment ? String(input.medicalTreatment).trim().slice(0, 20) : null,
    hasAttorney: input.hasAttorney ? String(input.hasAttorney).trim().slice(0, 20) : null,
    accidentRole: input.accidentRole ? String(input.accidentRole).trim().slice(0, 20) : null,
    injuredAtWork: input.injuredAtWork ? String(input.injuredAtWork).trim().slice(0, 20) : null,
    reportedToEmployer: input.reportedToEmployer ? String(input.reportedToEmployer).trim().slice(0, 20) : null,
    lostWages: input.lostWages ? String(input.lostWages).trim().slice(0, 20) : null,
    hasEvidence: input.hasEvidence ? String(input.hasEvidence).trim().slice(0, 20) : null,
    immigrationCaseType: input.immigrationCaseType ? String(input.immigrationCaseType).trim().slice(0, 40) : null,
    hasDeadline: input.hasDeadline ? String(input.hasDeadline).trim().slice(0, 20) : null,
    inUs: input.inUs ? String(input.inUs).trim().slice(0, 20) : null,
  };
}

export function validateLead(input) {
  const errors = [];
  if (!input || typeof input !== 'object') return ['Invalid payload'];
  const conversational = isConversationalSource(input.source);
  if (!conversational) {
    if (!input.name || !String(input.name).trim()) errors.push('Name is required');
    if (!input.consent) errors.push('Consent is required');
  }
  const phone = String(input.phone || '').replace(/[^\d+]/g, '');
  if ((input.phone || !conversational) && phone.length < 7) {
    errors.push('A valid phone number is required');
  }
  if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(input.email).trim())) {
    errors.push('Email is invalid');
  }
  return errors;
}

const CAMEL_TO_COL = {
  name: 'name',
  phone: 'phone',
  email: 'email',
  city: 'city',
  county: 'county',
  caseType: 'case_type',
  preferredLanguage: 'preferred_language',
  accidentDate: 'accident_date',
  injured: 'injured',
  policeResponded: 'police_responded',
  faultBelief: 'fault_belief',
  spokeWithInsurance: 'spoke_with_insurance',
  description: 'description',
  language: 'language',
  consent: 'consent',
  stateOfResidence: 'state_of_residence',
  accidentState: 'accident_state',
  vehicleDamage: 'vehicle_damage',
  hasPhotos: 'has_photos',
  medicalTreatment: 'medical_treatment',
  hasAttorney: 'has_attorney',
  accidentRole: 'accident_role',
  injuredAtWork: 'injured_at_work',
  reportedToEmployer: 'reported_to_employer',
  lostWages: 'lost_wages',
  hasEvidence: 'has_evidence',
  immigrationCaseType: 'immigration_case_type',
  hasDeadline: 'has_deadline',
  inUs: 'in_us',
};

export function buildLeadRow(input) {
  const clean = sanitizeFields(input);
  const row = { id: crypto.randomUUID(), received_at: new Date().toISOString(), updated_at: null };
  row.source = normalizeSource(input.source);
  for (const [camel, col] of Object.entries(CAMEL_TO_COL)) {
    row[col] = col === 'consent' ? (clean[camel] ? 1 : 0) : clean[camel];
  }
  return row;
}

// Only fields the client actually sent make it into the patch, so a
// progressive intake never blanks out answers saved earlier.
export function buildLeadPatch(input) {
  const clean = sanitizeFields(input);
  const patch = {};
  for (const [camel, col] of Object.entries(CAMEL_TO_COL)) {
    if (camel === 'language' && input.language === undefined) continue;
    if (camel === 'consent' && input.consent === undefined) continue;
    if (input[camel] !== undefined && clean[camel] !== null) {
      patch[col] = col === 'consent' ? (clean[camel] ? 1 : 0) : clean[camel];
    }
  }
  return patch;
}

// D1 row (snake_case) -> API response shape (camelCase), matching the old
// JSON-file lead shape so the admin page doesn't need to change.
export function rowToLead(row) {
  return {
    id: row.id,
    receivedAt: row.received_at,
    updatedAt: row.updated_at,
    source: row.source,
    name: row.name,
    phone: row.phone,
    email: row.email,
    city: row.city,
    county: row.county,
    caseType: row.case_type,
    preferredLanguage: row.preferred_language,
    accidentDate: row.accident_date,
    injured: row.injured,
    policeResponded: row.police_responded,
    faultBelief: row.fault_belief,
    spokeWithInsurance: row.spoke_with_insurance,
    description: row.description,
    language: row.language,
    consent: Boolean(row.consent),
    stateOfResidence: row.state_of_residence,
    accidentState: row.accident_state,
    vehicleDamage: row.vehicle_damage,
    hasPhotos: row.has_photos,
    medicalTreatment: row.medical_treatment,
    hasAttorney: row.has_attorney,
    accidentRole: row.accident_role,
    injuredAtWork: row.injured_at_work,
    reportedToEmployer: row.reported_to_employer,
    lostWages: row.lost_wages,
    hasEvidence: row.has_evidence,
    immigrationCaseType: row.immigration_case_type,
    hasDeadline: row.has_deadline,
    inUs: row.in_us,
    qualification: row.qualification,
    qualificationScore: row.qualification_score,
  };
}
