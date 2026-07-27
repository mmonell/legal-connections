// HOT/WARM/COLD lead scoring, per FORMATO DE CALIFICACIÓN DE LEAD —
// LEGAL CONNECTIONS (see /FORMATO DE CALIFICACIÓN DE LEAD — LEGAL
// CONNECTIONS.pdf, "SISTEMA DE CALIFICACIÓN"). Points below match that
// document exactly: 13+ = hot, 8-12 = warm, <8 = cold.

// Case types that count as a real "traffic accident" (Accidente de tránsito
// real) per the PDF's own type list: Carro / Moto / Camión / Uber-Lyft /
// Pasajero / Peatón. Non-vehicle case types (immigration, workers-comp, etc.)
// never qualify for this score — they aren't accident leads.
const TRAFFIC_ACCIDENT_TYPES = new Set([
  'car-accident',
  'motorcycle-accident',
  'truck-accident',
  'rideshare-accident',
  'pedestrian-accident',
  'bicycle-accident',
  'hit-and-run',
]);

const US_STATES = new Set([
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA',
  'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT',
  'VA', 'WA', 'WV', 'WI', 'WY', 'DC', 'PR',
]);

function isRecent(accidentDate) {
  // The intake stores either a concrete YYYY-MM-DD (0-14 days ago, per
  // lc-avatar) or the literal 'over-14-days'. The static form stores nothing
  // structured, so absence just doesn't earn the point rather than erroring.
  if (!accidentDate || accidentDate === 'over-14-days') return false;
  const date = new Date(accidentDate);
  if (Number.isNaN(date.getTime())) return false;
  const days = (Date.now() - date.getTime()) / 86_400_000;
  return days >= 0 && days <= 14;
}

function isUsState(value) {
  if (!value) return false;
  const v = String(value).trim().toUpperCase();
  return US_STATES.has(v) || v === 'US' || v === 'USA' || v === 'UNITED STATES';
}

// Returns { score, qualification: 'hot' | 'warm' | 'cold', reasons: string[] }.
// `lead` uses the same camelCase shape as buildLeadRow()/rowToLead() input.
export function scoreLead(lead) {
  let score = 0;
  const reasons = [];

  const add = (points, reason) => {
    score += points;
    reasons.push(`${reason} (+${points})`);
  };

  if (TRAFFIC_ACCIDENT_TYPES.has(lead.caseType)) add(3, 'Real traffic accident');
  if (isRecent(lead.accidentDate)) add(3, 'Happened recently (within 14 days)');
  if (lead.injured === 'yes' || lead.medicalTreatment === 'yes') add(3, 'Pain, injury, or received medical care');
  if (lead.vehicleDamage === 'yes') add(2, 'Visible vehicle damage');
  if (lead.hasPhotos === 'yes' || lead.policeResponded === 'yes') add(2, 'Has photos, plates, or a police report');
  if (lead.hasAttorney === 'no') add(2, 'Does not have an attorney yet');
  if (lead.faultBelief === 'other-driver') add(2, 'Caused by the other person');
  if (isUsState(lead.accidentState)) add(2, 'Happened in the United States');

  const qualification = score >= 13 ? 'hot' : score >= 8 ? 'warm' : 'cold';
  return { score, qualification, reasons };
}
