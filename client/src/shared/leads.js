// Shared lead sanitization/validation, ported from the old server/leadStore.js.
// Column names here are the D1 (snake_case) names; the JSON the browser sends
// is still camelCase, converted at the edges (buildLeadRow/patchRow).

const CONVERSATIONAL_SOURCES = new Set(['whatsapp-chat', 'avatar-intake']);
const SOURCES = new Set(['case-evaluation-form', 'whatsapp-chat', 'avatar-intake']);
const LANGUAGES = new Set(['en', 'es', 'pt']);

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
  };
}

export function validateLead(input) {
  const errors = [];
  if (!input || typeof input !== 'object') return ['Invalid payload'];
  const conversational = CONVERSATIONAL_SOURCES.has(input.source);
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
};

export function buildLeadRow(input) {
  const clean = sanitizeFields(input);
  const row = { id: crypto.randomUUID(), received_at: new Date().toISOString(), updated_at: null };
  row.source = SOURCES.has(input.source) ? input.source : 'case-evaluation-form';
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
  };
}
