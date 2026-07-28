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

// Days since a stored accident/incident date, or null if unknown/unparseable.
// The intake stores either a concrete YYYY-MM-DD or the literal 'over-14-days'
// (a homepage "more than 14 days ago" answer), which counts as not-recent.
function daysSince(dateStr) {
  if (!dateStr || dateStr === 'over-14-days') return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  return (Date.now() - date.getTime()) / 86_400_000;
}

function isRecent(accidentDate, windowDays = 14) {
  const days = daysSince(accidentDate);
  return days !== null && days >= 0 && days <= windowDays;
}

// Tier boundaries are shared across every service (per the auto PDF): a lead
// is HOT at 13+, WARM at 8-12, COLD below 8.
function tier(score) {
  return score >= 13 ? 'hot' : score >= 8 ? 'warm' : 'cold';
}

// Small helper each scorer uses to accumulate points + human-readable reasons.
function scorer() {
  let score = 0;
  const reasons = [];
  return {
    add(points, reason) {
      score += points;
      reasons.push(`${reason} (+${points})`);
    },
    result() {
      return { score, qualification: tier(score), reasons };
    },
  };
}

function isUsState(value) {
  if (!value) return false;
  const v = String(value).trim().toUpperCase();
  return US_STATES.has(v) || v === 'US' || v === 'USA' || v === 'UNITED STATES';
}

// All scorers return { score, qualification: 'hot'|'warm'|'cold', reasons: [] }.
// `lead` uses the same camelCase shape as buildLeadRow()/rowToLead() input.

// AUTO ACCIDENTS — exactly the FORMATO DE CALIFICACIÓN DE LEAD point system.
export function scoreLead(lead) {
  const s = scorer();
  if (TRAFFIC_ACCIDENT_TYPES.has(lead.caseType)) s.add(3, 'Real traffic accident');
  if (isRecent(lead.accidentDate, 14)) s.add(3, 'Happened recently (within 14 days)');
  if (lead.injured === 'yes' || lead.medicalTreatment === 'yes') s.add(3, 'Pain, injury, or received medical care');
  if (lead.vehicleDamage === 'yes') s.add(2, 'Visible vehicle damage');
  if (lead.hasPhotos === 'yes' || lead.policeResponded === 'yes') s.add(2, 'Has photos, plates, or a police report');
  if (lead.hasAttorney === 'no') s.add(2, 'Does not have an attorney yet');
  if (lead.faultBelief === 'other-driver') s.add(2, 'Caused by the other person');
  if (isUsState(lead.accidentState)) s.add(2, 'Happened in the United States');
  return s.result();
}

// PERSONAL INJURY — slip/fall, dog bite, malpractice, premises, product, etc.
const PERSONAL_INJURY_TYPES = new Set([
  'personal-injury', 'slip-and-fall', 'trip-and-fall', 'premises-liability',
  'dog-bite', 'defective-products', 'medical-malpractice', 'wrongful-death',
]);
export function scorePersonalInjury(lead) {
  const s = scorer();
  if (PERSONAL_INJURY_TYPES.has(lead.caseType) || lead.caseType === 'other') s.add(3, 'Valid personal-injury incident');
  if (isRecent(lead.accidentDate, 30)) s.add(3, 'Happened recently (within 30 days)');
  if (lead.injured === 'yes' || lead.medicalTreatment === 'yes') s.add(3, 'Injured or received medical care');
  if (lead.hasEvidence === 'yes' || lead.hasPhotos === 'yes') s.add(2, 'Has photos, report, or witnesses');
  if (lead.faultBelief === 'other-driver' || lead.faultBelief === 'other-party') s.add(2, 'Someone else at fault');
  if (lead.hasAttorney === 'no') s.add(2, 'Does not have an attorney yet');
  if (isUsState(lead.accidentState)) s.add(2, 'Happened in the United States');
  return s.result();
}

// WORKERS' COMP — job injuries. Longer recency window (claim windows are long).
export function scoreWorkersComp(lead) {
  const s = scorer();
  if (isRecent(lead.accidentDate, 90)) s.add(3, 'Happened recently (within 90 days)');
  if (lead.injuredAtWork === 'yes') s.add(3, 'Injured on the job');
  if (lead.medicalTreatment === 'yes') s.add(3, 'Received medical care');
  if (lead.reportedToEmployer === 'yes') s.add(2, 'Reported the injury to the employer');
  if (lead.lostWages === 'yes') s.add(2, 'Missed work or lost wages');
  if (lead.hasAttorney === 'no') s.add(2, 'Does not have an attorney yet');
  if (isUsState(lead.accidentState)) s.add(2, 'Happened in the United States');
  return s.result();
}

// IMMIGRATION — urgency-driven. A pending deadline/court date is the strongest
// signal, so it carries the most weight.
const URGENT_IMMIGRATION_TYPES = new Set(['deportation-defense', 'asylum']);
export function scoreImmigration(lead) {
  const s = scorer();
  if (lead.hasDeadline === 'yes') s.add(4, 'Has an upcoming deadline or court date');
  if (URGENT_IMMIGRATION_TYPES.has(lead.immigrationCaseType)) s.add(3, 'Time-sensitive case (deportation defense or asylum)');
  if (lead.inUs === 'yes') s.add(2, 'Currently in the United States');
  if (lead.hasAttorney === 'no') s.add(2, 'Does not have an attorney yet');
  if (lead.immigrationCaseType && lead.immigrationCaseType !== 'other') s.add(2, 'Valid immigration case type');
  return s.result();
}

// Dispatches to the right scorer by the lead's service/case type. Defaults to
// the auto-accident scorer (the original behavior) for traffic-accident and
// unknown case types.
export function scoreLeadForService(lead) {
  const ct = lead.caseType;
  if (ct === 'immigration' || lead.immigrationCaseType) return scoreImmigration(lead);
  if (ct === 'workers-comp') return scoreWorkersComp(lead);
  if (PERSONAL_INJURY_TYPES.has(ct)) return scorePersonalInjury(lead);
  return scoreLead(lead);
}
