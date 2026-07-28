// Per-service qualifying-question flows for the guided intake (lc-avatar) and
// the static form (lc-hero). Each service maps to an ordered list of question
// steps; the intake walks them one at a time and the form renders them as
// selects. Keeping the definitions here (not inside a component) lets both
// intake paths ask the SAME questions so a lead scores identically whichever
// way it came in. Scoring for these fields lives in src/shared/leadScore.js.
//
// Every step:
//   field    - the lead property it sets (camelCase, matches leads.js)
//   question - { en, es, pt } caption
//   control  - 'chips' | 'yesno' | 'yesnounsure' | 'select' | 'stateSelect' | 'dateSelect'
//   options  - for chips/select: [{ value, label:{en,es,pt} }]
//
// Shared option sets reused across services:
export const YES_NO = [
  { value: 'yes', label: { en: 'Yes', es: 'Sí', pt: 'Sim' } },
  { value: 'no', label: { en: 'No', es: 'No', pt: 'Não' } },
];
export const YES_NO_UNSURE = [
  ...YES_NO,
  { value: 'not-sure', label: { en: 'Not sure', es: 'No estoy seguro', pt: 'Não tenho certeza' } },
];

const qWhen = {
  field: 'accidentDate',
  control: 'dateSelect',
  question: { en: 'When did it happen?', es: '¿Cuándo ocurrió?', pt: 'Quando aconteceu?' },
};
const qAccidentState = {
  field: 'accidentState',
  control: 'stateSelect',
  question: { en: 'What state did it happen in?', es: '¿En qué estado ocurrió?', pt: 'Em que estado aconteceu?' },
};
const qHasAttorney = {
  field: 'hasAttorney',
  control: 'yesno',
  question: { en: 'Do you already have an attorney for this?', es: '¿Ya tienes abogado para esto?', pt: 'Você já tem um advogado para isso?' },
};

export const SERVICE_FLOWS = {
  // AUTO ACCIDENTS — the FORMATO DE CALIFICACIÓN DE LEAD question set.
  'auto-accidents': [
    qWhen,
    qAccidentState,
    {
      field: 'accidentRole',
      control: 'chips',
      question: { en: 'Were you the driver, a passenger, or a pedestrian?', es: '¿Ibas manejando, eras pasajero o peatón?', pt: 'Você estava dirigindo, era passageiro ou pedestre?' },
      options: [
        { value: 'driver', label: { en: 'Driver', es: 'Conductor', pt: 'Motorista' } },
        { value: 'passenger', label: { en: 'Passenger', es: 'Pasajero', pt: 'Passageiro' } },
        { value: 'pedestrian', label: { en: 'Pedestrian', es: 'Peatón', pt: 'Pedestre' } },
      ],
    },
    { field: 'injured', control: 'yesnounsure', question: { en: 'Were you injured?', es: '¿Resultaste lesionado?', pt: 'Você ficou ferido?' } },
    { field: 'medicalTreatment', control: 'yesno', question: { en: 'Did you receive medical care (hospital, clinic, or doctor)?', es: '¿Recibiste atención médica (hospital, clínica o doctor)?', pt: 'Você recebeu atendimento médico (hospital, clínica ou médico)?' } },
    { field: 'vehicleDamage', control: 'yesnounsure', question: { en: 'Was there damage to the vehicle?', es: '¿Hubo daño en el vehículo?', pt: 'Houve dano no veículo?' } },
    { field: 'policeResponded', control: 'yesnounsure', question: { en: 'Did police respond to the accident?', es: '¿La policía respondió al accidente?', pt: 'A polícia foi acionada no acidente?' } },
    { field: 'hasPhotos', control: 'yesno', question: { en: 'Do you have photos of the accident, plates, or damage?', es: '¿Tienes fotos del accidente, placas o daños?', pt: 'Você tem fotos do acidente, placas ou danos?' } },
    {
      field: 'faultBelief',
      control: 'chips',
      question: { en: 'Who do you think caused it?', es: '¿Quién crees que lo causó?', pt: 'Quem você acha que causou?' },
      options: [
        { value: 'other-driver', label: { en: 'The other driver', es: 'El otro conductor', pt: 'O outro motorista' } },
        { value: 'me', label: { en: 'Me', es: 'Yo', pt: 'Eu' } },
        { value: 'shared', label: { en: 'Both', es: 'Ambos', pt: 'Ambos' } },
        { value: 'not-sure', label: { en: 'Not sure', es: 'No estoy seguro', pt: 'Não tenho certeza' } },
      ],
    },
    { field: 'spokeWithInsurance', control: 'yesno', question: { en: 'Have you spoken with an insurance company yet?', es: '¿Ya hablaste con alguna aseguradora?', pt: 'Você já falou com alguma seguradora?' } },
    qHasAttorney,
  ],

  // PERSONAL INJURY — slip/fall, dog bite, malpractice, premises, product.
  'personal-injury': [
    qWhen,
    qAccidentState,
    { field: 'injured', control: 'yesnounsure', question: { en: 'Were you injured?', es: '¿Resultaste lesionado?', pt: 'Você ficou ferido?' } },
    { field: 'medicalTreatment', control: 'yesno', question: { en: 'Did you receive medical care?', es: '¿Recibiste atención médica?', pt: 'Você recebeu atendimento médico?' } },
    { field: 'hasEvidence', control: 'yesno', question: { en: 'Do you have any evidence (photos, a report, or witnesses)?', es: '¿Tienes alguna evidencia (fotos, un reporte o testigos)?', pt: 'Você tem alguma evidência (fotos, um boletim ou testemunhas)?' } },
    {
      field: 'faultBelief',
      control: 'chips',
      question: { en: 'Who do you think was at fault?', es: '¿Quién crees que tuvo la culpa?', pt: 'Quem você acha que teve a culpa?' },
      options: [
        { value: 'other-party', label: { en: 'Someone else / a business', es: 'Otra persona / un negocio', pt: 'Outra pessoa / uma empresa' } },
        { value: 'me', label: { en: 'Me', es: 'Yo', pt: 'Eu' } },
        { value: 'not-sure', label: { en: 'Not sure', es: 'No estoy seguro', pt: 'Não tenho certeza' } },
      ],
    },
    qHasAttorney,
  ],

  // WORKERS' COMP — job injuries.
  'workers-comp': [
    qWhen,
    qAccidentState,
    { field: 'injuredAtWork', control: 'yesno', question: { en: 'Were you injured while working / on the job?', es: '¿Te lesionaste mientras trabajabas / en el trabajo?', pt: 'Você se lesionou enquanto trabalhava / no trabalho?' } },
    { field: 'reportedToEmployer', control: 'yesnounsure', question: { en: 'Did you report the injury to your employer?', es: '¿Reportaste la lesión a tu empleador?', pt: 'Você reportou a lesão ao seu empregador?' } },
    { field: 'medicalTreatment', control: 'yesno', question: { en: 'Did you receive medical care?', es: '¿Recibiste atención médica?', pt: 'Você recebeu atendimento médico?' } },
    { field: 'lostWages', control: 'yesno', question: { en: 'Have you missed work or lost wages because of it?', es: '¿Has faltado al trabajo o perdido salario por esto?', pt: 'Você faltou ao trabalho ou perdeu salário por causa disso?' } },
    qHasAttorney,
  ],

  // IMMIGRATION — urgency-driven.
  immigration: [
    {
      field: 'immigrationCaseType',
      control: 'chips',
      question: { en: 'What type of immigration case is it?', es: '¿Qué tipo de caso de inmigración es?', pt: 'Que tipo de caso de imigração é?' },
      options: [
        { value: 'deportation-defense', label: { en: 'Deportation defense', es: 'Defensa de deportación', pt: 'Defesa de deportação' } },
        { value: 'asylum', label: { en: 'Asylum', es: 'Asilo', pt: 'Asilo' } },
        { value: 'family', label: { en: 'Family / green card', es: 'Familia / green card', pt: 'Família / green card' } },
        { value: 'work-visa', label: { en: 'Work visa', es: 'Visa de trabajo', pt: 'Visto de trabalho' } },
        { value: 'citizenship', label: { en: 'Citizenship', es: 'Ciudadanía', pt: 'Cidadania' } },
        { value: 'other', label: { en: 'Other', es: 'Otro', pt: 'Outro' } },
      ],
    },
    { field: 'hasDeadline', control: 'yesnounsure', question: { en: 'Is there an upcoming deadline or court date?', es: '¿Hay una fecha límite o cita en la corte próxima?', pt: 'Há um prazo ou data de audiência próxima?' } },
    { field: 'inUs', control: 'yesno', question: { en: 'Are you currently in the United States?', es: '¿Estás actualmente en Estados Unidos?', pt: 'Você está atualmente nos Estados Unidos?' } },
    qHasAttorney,
  ],
};

// Maps a homepage/service case-type value to its flow key. The homepage's
// "what happened / what do you need help with" answers use these case-type
// values; service landing pages pass the flow key directly as `case`.
export const CASE_TYPE_TO_FLOW = {
  'car-accident': 'auto-accidents',
  'motorcycle-accident': 'auto-accidents',
  'truck-accident': 'auto-accidents',
  'pedestrian-accident': 'auto-accidents',
  'bicycle-accident': 'auto-accidents',
  'rideshare-accident': 'auto-accidents',
  'hit-and-run': 'auto-accidents',
  'personal-injury': 'personal-injury',
  'workers-comp': 'workers-comp',
  immigration: 'immigration',
};

export function flowForCaseType(caseType) {
  return CASE_TYPE_TO_FLOW[caseType] || null;
}
