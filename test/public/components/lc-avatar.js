import { LC } from '../config.js';
import { t, getLang, setLang, LANGS, LANG_META, onLangChange } from '../i18n.js';

const strings = {
  sub: {
    en: 'Connected by Trust',
    es: 'Connected by Trust',
    pt: 'Connected by Trust',
  },
  qAccident: { en: 'Were you involved in an accident?', es: '¿Estuviste involucrado en un accidente?', pt: 'Você se envolveu em um acidente?' },
  yes: { en: 'Yes', es: 'Sí', pt: 'Sim' },
  no: { en: 'No', es: 'No', pt: 'Não' },
  notSure: { en: 'Not sure', es: 'No estoy seguro', pt: 'Não tenho certeza' },

  qWhat: { en: "I'm sorry to hear that. What happened?", es: 'Lamento escuchar eso. ¿Qué pasó?', pt: 'Sinto muito por isso. O que aconteceu?' },
  whatTypes: [
    { value: 'car-accident', label: { en: 'Car', es: 'Auto', pt: 'Carro' } },
    { value: 'motorcycle-accident', label: { en: 'Motorcycle', es: 'Motora', pt: 'Moto' } },
    { value: 'truck-accident', label: { en: 'Truck', es: 'Camión', pt: 'Caminhão' } },
    { value: 'pedestrian-accident', label: { en: 'Pedestrian', es: 'Peatón', pt: 'Pedestre' } },
    { value: 'bicycle-accident', label: { en: 'Bicycle', es: 'Bicicleta', pt: 'Bicicleta' } },
    { value: 'rideshare-accident', label: { en: 'Uber/Lyft', es: 'Uber/Lyft', pt: 'Uber/Lyft' } },
    { value: 'hit-and-run', label: { en: 'Hit & Run', es: 'Conductor que huyó', pt: 'Motorista que fugiu' } },
    { value: 'other', label: { en: 'Other', es: 'Otro', pt: 'Outro' } },
  ],
  qCaseOther: {
    en: 'No problem. We also connect people with trusted professionals for many other matters. What do you need help with?',
    es: 'No hay problema. También conectamos a personas con profesionales de confianza para muchos otros asuntos. ¿Con qué necesitas ayuda?',
    pt: 'Sem problema. Também conectamos pessoas com profissionais de confiança para muitos outros assuntos. Com o que você precisa de ajuda?',
  },
  otherTypes: [
    { value: 'personal-injury', label: { en: 'Personal Injury', es: 'Daños Personales', pt: 'Danos Pessoais' } },
    { value: 'workers-comp', label: { en: "Workers' Comp", es: 'Compensación Laboral', pt: 'Indenização Trabalhista' } },
    { value: 'immigration', label: { en: 'Immigration', es: 'Inmigración', pt: 'Imigração' } },
    { value: 'social-security', label: { en: 'Social Security', es: 'Seguro Social', pt: 'Seguridade Social' } },
    { value: 'other', label: { en: 'Something else', es: 'Otra cosa', pt: 'Outra coisa' } },
  ],

  qWhen: { en: 'When did it happen?', es: '¿Cuándo ocurrió?', pt: 'Quando aconteceu?' },
  whenPlaceholder: { en: '- Select when -', es: '- Selecciona cuándo -', pt: '- Selecione quando -' },
  whenToday: { en: 'Today', es: 'Hoy', pt: 'Hoje' },
  whenYesterday: { en: 'Yesterday', es: 'Ayer', pt: 'Ontem' },
  whenDaysAgo: { en: '{n} days ago', es: 'Hace {n} días', pt: 'Há {n} dias' },
  whenOver14: { en: 'More than 14 days ago', es: 'Hace más de 14 días', pt: 'Há mais de 14 dias' },
  qInjured: { en: 'Were you injured?', es: '¿Resultaste lesionado?', pt: 'Você ficou ferido?' },
  qPolice: { en: 'Did police respond to the accident?', es: '¿La policía respondió al accidente?', pt: 'A polícia foi acionada no acidente?' },
  qFault: { en: 'Who do you think caused it?', es: '¿Quién crees que lo causó?', pt: 'Quem você acha que causou o acidente?' },
  faultOptions: [
    { value: 'other-driver', label: { en: 'The other driver', es: 'El otro conductor', pt: 'O outro motorista' } },
    { value: 'me', label: { en: 'Me', es: 'Yo', pt: 'Eu' } },
    { value: 'shared', label: { en: 'Both', es: 'Ambos', pt: 'Ambos' } },
    { value: 'not-sure', label: { en: 'Not sure', es: 'No estoy seguro', pt: 'Não tenho certeza' } },
  ],
  qInsurance: {
    en: 'Have you spoken with an insurance company yet?',
    es: '¿Ya hablaste con alguna aseguradora?',
    pt: 'Você já falou com alguma seguradora?',
  },

  guidanceIntro: {
    en: 'Thanks. Based on what you told me, you may have options. I recommend speaking with an accident specialist. Getting connected costs you nothing.',
    es: 'Gracias. Según lo que me contaste, podrías tener opciones. Te recomiendo hablar con un especialista en accidentes. Conectarte no te cuesta nada.',
    pt: 'Obrigado. Com base no que você me contou, você pode ter opções. Recomendo falar com um especialista em acidentes. Conectar-se não custa nada.',
  },
  guidanceIntroOther: {
    en: 'Good news: our network can point you to the right professional, at no cost to you.',
    es: 'Buenas noticias: nuestra red puede orientarte hacia el profesional correcto, sin costo para ti.',
    pt: 'Boas notícias: nossa rede pode te direcionar ao profissional certo, sem nenhum custo para você.',
  },
  guidanceItems: {
    medical: { en: 'Medical treatment may be available', es: 'Tratamiento médico puede estar disponible', pt: 'Tratamento médico pode estar disponível' },
    rental: { en: 'Rental vehicle assistance', es: 'Asistencia con vehículo de alquiler', pt: 'Assistência com veículo de aluguel' },
    wages: { en: 'Lost wages', es: 'Salarios perdidos', pt: 'Salários perdidos' },
    pain: { en: 'Pain and suffering', es: 'Daños y sufrimiento', pt: 'Dor e sofrimento' },
    property: { en: 'Property damage', es: 'Daños a la propiedad', pt: 'Danos materiais' },
    genericAttorneys: { en: 'Trusted attorneys for your situation', es: 'Abogados de confianza para tu situación', pt: 'Advogados de confiança para sua situação' },
    genericMedical: { en: 'A medical network if you need care', es: 'Una red médica si necesitas atención', pt: 'Uma rede médica caso precise de atendimento' },
    genericFree: { en: 'Guidance at no cost to you', es: 'Orientación sin costo para ti', pt: 'Orientação sem nenhum custo para você' },
  },
  getConnected: { en: 'Get connected', es: 'Conéctame', pt: 'Conectar-me' },

  qName: {
    en: 'Great. Who am I speaking with? Please type your first and last name.',
    es: 'Perfecto. ¿Con quién hablo? Escribe tu nombre y apellido.',
    pt: 'Ótimo. Com quem estou falando? Digite seu nome e sobrenome.',
  },
  qPhone: {
    en: 'Nice to meet you, {name}. What is the best phone number to reach you?',
    es: 'Mucho gusto, {name}. ¿Cuál es el mejor número para contactarte?',
    pt: 'Prazer em conhecê-lo, {name}. Qual é o melhor telefone para contatá-lo?',
  },
  qEmail: {
    en: 'Got it. What is your e-mail address?',
    es: 'Anotado. ¿Cuál es tu correo electrónico?',
    pt: 'Entendido. Qual é o seu e-mail?',
  },
  qLang: {
    en: 'Which language do you prefer for us to contact you in?',
    es: '¿En qué idioma prefieres que te contactemos?',
    pt: 'Em qual idioma você prefere que entremos em contato?',
  },
  languages: [
    { value: 'en', label: { en: 'English', es: 'English (Inglés)', pt: 'English (Inglês)' } },
    { value: 'es', label: { en: 'Español (Spanish)', es: 'Español', pt: 'Español (Espanhol)' } },
    { value: 'pt', label: { en: 'Português (Portuguese)', es: 'Português (Portugués)', pt: 'Português' } },
  ],
  done: {
    en: 'Thank you, {name}! Your information is saved. An accident specialist will call you back shortly.',
    es: '¡Gracias, {name}! Tu información quedó guardada. Un especialista te devolverá la llamada pronto.',
    pt: 'Obrigado, {name}! Suas informações foram salvas. Um especialista em acidentes retornará sua ligação em breve.',
  },
  doneNoSave: {
    en: 'Thank you, {name}! We had trouble saving your information, so please call us directly and we will take it from there.',
    es: '¡Gracias, {name}! Tuvimos un problema guardando tu información, así que llámanos directamente y nos encargamos desde ahí.',
    pt: 'Obrigado, {name}! Tivemos um problema ao salvar suas informações, então ligue diretamente para nós e cuidaremos do resto.',
  },
  send: { en: 'Send', es: 'Enviar', pt: 'Enviar' },
  skip: { en: 'Skip', es: 'Omitir', pt: 'Pular' },
  disclaimer: {
    en: 'Legal Connections is a legal referral network, not a law firm, and does not provide legal advice. Submitting information does not create an attorney–client relationship. Results are never guaranteed.',
    es: 'Legal Connections es una red de referidos legales, no un bufete de abogados, y no ofrece asesoría legal. Enviar información no crea una relación abogado–cliente. Los resultados nunca están garantizados.',
    pt: 'Legal Connections é uma rede de referência jurídica, não um escritório de advocacia, e não presta consultoria jurídica. O envio de informações não cria uma relação advogado–cliente. Os resultados nunca são garantidos.',
  },
  rights: { en: 'All rights reserved.', es: 'Todos los derechos reservados.', pt: 'Todos os direitos reservados.' },
  callNow: { en: 'Call Now', es: 'Llama Ya', pt: 'Ligue Agora' },
  whatsapp: { en: 'WhatsApp Us', es: 'Escríbenos por WhatsApp', pt: 'Fale Conosco pelo WhatsApp' },
  restart: { en: 'Start over', es: 'Comenzar de nuevo', pt: 'Começar de novo' },
  namePlaceholder: { en: 'First and last name', es: 'Nombre y apellido', pt: 'Nome e sobrenome' },
  phonePlaceholder: { en: 'Phone number', es: 'Número de teléfono', pt: 'Número de telefone' },
  emailPlaceholder: { en: 'E-mail', es: 'Correo electrónico', pt: 'E-mail' },
  errName: { en: 'Please tell us your name.', es: 'Por favor dinos tu nombre.', pt: 'Por favor, informe seu nome.' },
  errPhone: { en: 'Please enter a valid phone number.', es: 'Por favor escribe un número de teléfono válido.', pt: 'Por favor, insira um número de telefone válido.' },
  errEmail: { en: 'That e-mail does not look right.', es: 'Ese correo no parece válido.', pt: 'Esse e-mail não parece válido.' },
  legal: {
    en: 'By sending your phone number you authorize Legal Connections and its service providers to contact you by phone call, text message, or WhatsApp at the number submitted. Consent is not a condition to receive services. Msg & data rates may apply. Reply STOP to unsubscribe.',
    es: 'Al enviar tu número de teléfono autorizas a Legal Connections y a sus proveedores de servicio a contactarte por llamada, mensaje de texto o WhatsApp al número indicado. El consentimiento no es una condición para recibir servicios. Pueden aplicar tarifas de mensajes y datos. Responde STOP para cancelar.',
    pt: 'Ao enviar seu número de telefone, você autoriza a Legal Connections e seus prestadores de serviço a entrarem em contato por ligação, mensagem de texto ou WhatsApp no número informado. O consentimento não é uma condição para receber serviços. Podem ser aplicadas tarifas de mensagens e dados. Responda STOP para cancelar.',
  },
  whatsappGreeting: {
    en: 'Hi! I just completed the virtual assistant intake on your website.',
    es: '¡Hola! Acabo de completar la entrevista con la asistente virtual en su página.',
    pt: 'Olá! Acabei de concluir o atendimento com a assistente virtual no site de vocês.',
  },
};

/* ---------------------------------------------------------------------------
 * ParticleField: emerald sprites on canvas with two formations.
 *  1. 'logo' - on load the sprites gather into the "LEGAL CONNECTIONS"
 *     wordmark (sampled from the white wordmark-only crop of the brand logo).
 *  2. 'orb'  - a slowly rotating 3D particle orb that floats around the
 *     center; the sprites swirl with it.
 * Every answered question toggles the formation (logo -> orb -> logo -> ...).
 * While the assistant "speaks", the orb pulses gently.
 * ------------------------------------------------------------------------- */
const LOGO_SRC = '/assets/logo/legal-connections-wordmark.png';
const cachedLogoPointsByKey = new Map(); // 'wordmark' or arbitrary title text -> sampled points

function easeInOut(x) {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
}

// Shared halftone sampler: takes a canvas already drawn with white-on-transparent
// content and turns bright pixels into normalized sprite target points.
function sampleCanvasPoints(canvas) {
  const w = canvas.width;
  const h = canvas.height;
  const c = canvas.getContext('2d', { willReadFrequently: true });
  const data = c.getImageData(0, 0, w, h).data;

  const raw = [];
  const step = 3; // grid pitch: a few thousand evenly spaced points
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      const o = (y * w + x) * 4;
      const a = data[o + 3] / 255;
      const lumin = (data[o] + data[o + 1] + data[o + 2]) / 765;
      if (a > 0.35 && lumin > 0.2) {
        raw.push({ x, y, b: Math.min(1, 0.35 + 0.65 * lumin * a) });
      }
    }
  }
  if (!raw.length) return [];

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const p of raw) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const bw = Math.max(1, maxX - minX);
  const bh = Math.max(1, maxY - minY);
  // Normalize to a -1..1 box on the LONG axis (width, since text/wordmarks are
  // wide) so the draw step can size it against the canvas's own aspect ratio
  // instead of guessing a fixed scale that only fit one box size.
  const points = raw.map((p) => ({
    x: ((p.x - cx) / bw) * 2,
    y: ((p.y - cy) / bw) * 2, // divide by width on both axes to preserve the true aspect ratio
    b: p.b,
  }));
  points.aspect = bw / bh;
  return points;
}

async function sampleLogoPoints() {
  if (cachedLogoPointsByKey.has('wordmark')) return cachedLogoPointsByKey.get('wordmark');
  const img = new Image();
  img.src = LOGO_SRC;
  await img.decode();
  // Sample on a REGULAR grid at high resolution: even spacing reads as a
  // clean halftone of the wordmark. (Random subsampling clumps and leaves
  // holes, which made the letters look furry.)
  const targetW = 800;
  const w = targetW;
  const h = Math.max(1, Math.round((img.naturalHeight / img.naturalWidth) * targetW));
  const off = document.createElement('canvas');
  off.width = w;
  off.height = h;
  off.getContext('2d').drawImage(img, 0, 0, w, h);
  const points = sampleCanvasPoints(off);
  cachedLogoPointsByKey.set('wordmark', points);
  return points;
}

// Renders arbitrary title text (e.g. "Auto Accidents") in the brand font and
// samples it the same way as the wordmark image, so service landing pages
// can have the sprites spell out their own title instead of the brand name.
function sampleTitlePoints(text) {
  if (cachedLogoPointsByKey.has(text)) return cachedLogoPointsByKey.get(text);
  const off = document.createElement('canvas');
  const h = 200;
  const w = 1600; // generous width, cropped to actual text bounds below
  off.width = w;
  off.height = h;
  const c = off.getContext('2d');
  c.fillStyle = '#fff';
  c.font = `800 ${h * 0.62}px "Avenir Next", "Segoe UI", "Helvetica Neue", Arial, sans-serif`;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText(text.toUpperCase(), w / 2, h / 2);
  const points = sampleCanvasPoints(off);
  cachedLogoPointsByKey.set(text, points);
  return points;
}

class ParticleField {
  constructor(canvas, { mode = 'logo', skipAssembly = false, logoText = null } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.skipAssembly = skipAssembly || this.reduced;
    this.logoText = logoText; // null = brand wordmark image; string = render this title instead
    // Formation blend: 0 = logo, 1 = orb. `m` eases toward `target` each frame.
    this.m = mode === 'orb' ? 1 : 0;
    this.target = this.m;
    this.speaking = false;
    this.speak = 0;
    this.raf = 0;
    this.assembled = false;
    this.loaded = false;
    this.ready = new Promise((res) => { this._readyRes = res; });
    this._init();
  }

  async _init() {
    let logo = [];
    try {
      logo = this.logoText ? sampleTitlePoints(this.logoText) : await sampleLogoPoints();
    } catch (err) {
      console.error('Could not load logo for the intro:', err);
    }
    const count = Math.max(logo.length, 1200);
    this.parts = [];
    for (let i = 0; i < count; i++) {
      const lp = logo.length ? logo[i % logo.length] : { x: 0, y: 0, b: 0.7 };
      this.parts.push({
        // logo formation
        lx: lp.x,
        ly: lp.y,
        lb: lp.b,
        // orb formation: point on/near a sphere, drifting along its ring
        r: 0.5 * (0.8 + 0.2 * Math.random()),
        phi: Math.acos(2 * Math.random() - 1),
        th0: Math.random() * Math.PI * 2,
        spd: (0.15 + 0.3 * Math.random()) * (Math.random() < 0.5 ? -1 : 1),
        // Intro: the wordmark "writes" itself left to right. Each dot rises a
        // short distance into its spot, staggered by its x position, instead
        // of the old random scatter that read as a noisy box.
        sx: lp.x,
        sy: lp.y + 0.10 + Math.random() * 0.06,
        delay: this.skipAssembly ? 0 : ((lp.x + 1) / 2) * 0.9 + Math.random() * 0.12,
        dur: this.skipAssembly ? 0.01 : 0.45 + Math.random() * 0.25,
        phase: Math.random() * Math.PI * 2,
        hue: 152 + Math.random() * 14, // brand emerald range
      });
    }
    this.totalAssemble = this.skipAssembly
      ? 0
      : Math.max(...this.parts.map((p) => p.delay + p.dur));
    this.t0 = performance.now();
    this.loaded = true;
    if (this.skipAssembly) {
      this.assembled = true;
      this._readyRes();
      if (this.reduced) this.draw(this.t0 + 1000);
    }
  }

  toggle() {
    this.target = this.target ? 0 : 1;
    if (this.reduced && this.loaded) {
      this.m = this.target;
      this.draw(performance.now() + 5000);
    }
  }

  start() {
    if (this.reduced) return; // static frames only
    const loop = (now) => {
      this.draw(now);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop() {
    cancelAnimationFrame(this.raf);
  }

  setSpeaking(v) {
    this.speaking = v;
  }

  draw(now) {
    if (!this.loaded) return;
    const { canvas, ctx } = this;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth * dpr;
    const h = canvas.clientHeight * dpr;
    if (!w || !h) return;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    ctx.clearRect(0, 0, w, h);

    const time = (now - this.t0) / 1000;
    this.speak += ((this.speaking ? 1 : 0) - this.speak) * 0.07;
    if (!this.assembled && time > this.totalAssemble + 0.1) {
      this.assembled = true;
      this._readyRes();
    }

    if (!this.reduced) this.m += (this.target - this.m) * 0.05;
    const m = easeInOut(this.m);
    // The wordmark is wide (points normalized to -1..1 on X); fit it to the
    // canvas width with margin. The orb is roughly circular; fit it to the
    // smaller dimension so it isn't clipped top/bottom.
    const logoScale = w * 0.44;
    const orbScale = Math.min(w, h) * 0.62;
    const scale = logoScale + (orbScale - logoScale) * m;
    // the orb floats around the center, sprites and all
    const wanderX = m * 0.1 * Math.sin(time * 0.33 + 1);
    const wanderY = m * 0.07 * Math.sin(time * 0.41 + 2) + m * 0.02 * Math.sin(time * 0.9);
    const cx = w / 2 + wanderX * orbScale;
    const cy = h / 2 + wanderY * orbScale;
    const pulse = 1 + this.speak * (0.035 + 0.03 * Math.sin(time * 7));
    const tilt = 0.35;
    const cosT = Math.cos(tilt);
    const sinT = Math.sin(tilt);

    for (const p of this.parts) {
      const prog = this.reduced ? 1 : Math.max(0, Math.min(1, (time - p.delay) / p.dur));
      if (prog <= 0) continue;
      const ease = 1 - (1 - prog) ** 3;

      // logo formation with a very faint shimmer (kept below the grid pitch
      // so the letterforms stay crisp)
      const lx = p.lx + 0.0015 * Math.sin(time * 0.9 + p.phase);
      const ly = p.ly + 0.0015 * Math.cos(time * 0.8 + p.phase * 1.3);

      // orb formation: rotating tilted sphere
      const theta = p.th0 + time * p.spd;
      const rr = p.r * pulse;
      const ringR = Math.sin(p.phi) * rr;
      const x3 = Math.cos(theta) * ringR;
      const z3 = Math.sin(theta) * ringR;
      const y3 = Math.cos(p.phi) * rr;
      const oy = y3 * cosT - z3 * sinT;
      const oz = y3 * sinT + z3 * cosT;
      const depth = Math.max(0, Math.min(1, (oz / rr + 1) / 2));

      // blend formations, then blend in the gather-in start
      const tx = lx + (x3 - lx) * m;
      const ty = ly + (oy - ly) * m;
      const x = p.sx + (tx - p.sx) * ease;
      const y = p.sy + (ty - p.sy) * ease;

      const b = p.lb + (0.15 + 0.85 * depth - p.lb) * m;
      const alpha = (0.2 + 0.8 * b) * ease * ease * (1 + this.speak * 0.15 * m);
      // small tight dots in the wordmark, chunkier ones once it becomes the orb
      const size = ((0.5 + b * 0.5) + m * (0.3 + b * 1.1)) * dpr;
      const light = 40 + b * 45;
      ctx.fillStyle = `hsla(${p.hue}, 55%, ${light}%, ${Math.min(1, alpha)})`;
      ctx.fillRect(cx + x * scale, cy + y * scale, size, size);
    }
  }
}

/* ---------------------------------------------------------------------------
 * LcAvatar: guided decision-engine intake (spec: /planning/specs/
 * guided-intake-concept_spec.md). One question at a time, minimal typing,
 * useful guidance BEFORE asking for contact info. Every answer is saved as it
 * arrives: POST creates the lead, PATCH updates it per answer
 * (source: 'avatar-intake').
 * ------------------------------------------------------------------------- */
// Service pages pre-seed the intake so clicking "Start" doesn't re-ask
// "what happened?" when the visitor already told us via the page they're on.
const CASE_PRESETS = {
  'auto-accidents': {
    branch: 'accident',
    caseType: 'car-accident',
    title: { en: 'Auto Accidents', es: 'Accidentes de Auto', pt: 'Acidentes de Carro' },
    spriteTitle: { en: 'Auto Accident?', es: '¿Accidente de Auto?', pt: 'Acidente de Carro?' },
  },
  'personal-injury': {
    branch: 'other',
    caseType: 'personal-injury',
    title: { en: 'Personal Injury', es: 'Daños Personales', pt: 'Danos Pessoais' },
    spriteTitle: { en: 'Personal Injury?', es: '¿Daño Personal?', pt: 'Danos Pessoais?' },
  },
  'workers-comp': {
    branch: 'other',
    caseType: 'workers-comp',
    title: { en: 'Workers’ Compensation', es: 'Compensación Laboral', pt: 'Indenização Trabalhista' },
    spriteTitle: { en: 'Workers’ Comp?', es: '¿Compensación Laboral?', pt: 'Indenização Trabalhista?' },
  },
  immigration: {
    branch: 'other',
    caseType: 'immigration',
    title: { en: 'Immigration', es: 'Inmigración', pt: 'Imigração' },
    spriteTitle: { en: 'Immigration?', es: '¿Inmigración?', pt: 'Imigração?' },
  },
};

class LcAvatar extends HTMLElement {
  connectedCallback() {
    const preset = CASE_PRESETS[this.getAttribute('case')];
    // Skip the "were you in an accident" + "what happened" questions when the
    // service page already told us the answer.
    this.stepId = this.stepId || (preset ? (preset.branch === 'accident' ? 'when' : 'guidance') : 'accident');
    this.branch = this.branch || preset?.branch || null; // 'accident' | 'other'
    this.lead = this.lead || (preset ? { caseType: preset.caseType } : {});
    this.presetTitle = preset?.title || null; // service name shown instead of the tagline
    this.presetSpriteTitle = preset?.spriteTitle || preset?.title || null; // sprite wording (singular + "?")
    this.banner = this.hasAttribute('banner'); // compact hero-banner mode
    this.spriteTitle = this.hasAttribute('sprite-title'); // sprites spell the service title, small lc logo above
    this.mode = this.mode || 'logo'; // current sprite formation
    this.leadId = this.leadId || null;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.render();
    onLangChange(this, () => {
      this.render();
      this.showStep(true);
    });
    // The conversation starts only after the sprites finish forming the logo.
    this.face.ready.then(() => this.showStep());
  }

  disconnectedCallback() {
    this.face?.stop();
    clearInterval(this._typeTimer);
  }

  firstName() {
    return (this.lead.name || '').trim().split(/\s+/)[0] || '';
  }

  render() {
    this.face?.stop();
    const lang = getLang();
    const banner = this.banner;
    this.innerHTML = `
      <style>
        lc-avatar .stage {
          position: relative;
          min-height: ${banner ? '640px' : '100vh'};
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: ${banner ? '56px 20px' : '24px 20px 156px'};
          background:
            radial-gradient(700px 620px at 50% 40%, rgba(46, 107, 90, 0.32), transparent 70%),
            radial-gradient(1200px 500px at 80% -10%, rgba(255,255,255,0.08), transparent 60%),
            var(--lc-black);
          color: var(--lc-white);
        }
        lc-avatar .lang-wrap { position: absolute; top: 18px; right: 20px; }
        lc-avatar .lang {
          display: flex; align-items: center; gap: 6px;
          background: transparent; color: var(--lc-white);
          border: 1px solid rgba(255,255,255,0.4); border-radius: 999px;
          padding: 7px 16px; font-weight: 700; cursor: pointer; font-family: var(--lc-font);
          font-size: 0.9rem;
        }
        lc-avatar .lang:hover { border-color: var(--lc-white); background: rgba(255,255,255,0.08); }
        lc-avatar .lang-menu {
          position: absolute; top: calc(100% + 8px); right: 0; z-index: 60;
          background: var(--lc-black); border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px; padding: 6px; min-width: 150px;
          box-shadow: 0 12px 28px rgba(0,0,0,0.35);
          display: none; flex-direction: column;
        }
        lc-avatar .lang-menu.open { display: flex; }
        lc-avatar .lang-menu button {
          display: flex; align-items: center; gap: 10px;
          background: transparent; color: var(--lc-white); border: none;
          border-radius: 8px; padding: 8px 10px; font-family: var(--lc-font);
          font-weight: 600; font-size: 0.9rem; text-align: left; cursor: pointer;
        }
        lc-avatar .lang-menu button:hover,
        lc-avatar .lang-menu button[aria-current="true"] { background: rgba(255,255,255,0.1); }
        lc-avatar .kicker {
          text-transform: uppercase; letter-spacing: 0.14em;
          font-size: 0.78rem; font-weight: 700; color: var(--lc-cta);
        }
        lc-avatar .sub {
          font-size: 0.8rem; color: rgb(255, 255, 255); font-weight: 600;
          margin-top: 4px;
        }
        lc-avatar .mark-stack {
          display: flex; flex-direction: column; align-items: center; gap: 0;
        }
        lc-avatar img.mark { width: auto; opacity: 0.95; }
        lc-avatar img.mark-mini { height: 190px; margin-bottom: -52px; }
        lc-avatar img.mark-word { height: 44px; }
        lc-avatar canvas.orb {
          width: min(92vw, 680px); height: min(36vh, 300px);
          display: block;
        }
        lc-avatar .caption {
          min-height: 4.2em; max-width: 34em;
          text-align: center; white-space: pre-line;
          font-size: clamp(1.08rem, 2.4vw, 1.4rem); font-weight: 700; line-height: 1.45;
        }
        lc-avatar .caption .cursor {
          display: inline-block; width: 0.55em; margin-left: 2px;
          border-bottom: 3px solid #7fd4bc;
          animation: lc-blink 0.9s steps(1) infinite;
        }
        @keyframes lc-blink { 50% { opacity: 0; } }
        lc-avatar .controls {
          margin-top: 18px; width: 100%; max-width: 560px;
          display: flex; flex-direction: column; align-items: center; gap: 14px;
          opacity: 0; transform: translateY(6px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }
        lc-avatar .controls.show { opacity: 1; transform: none; }
        lc-avatar .chips { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
        lc-avatar .chip {
          border: 2px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.05);
          color: var(--lc-white); border-radius: 999px; padding: 13px 24px;
          font-family: var(--lc-font); font-size: 1rem; font-weight: 700; cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease;
        }
        lc-avatar .chip:hover {
          border-color: var(--lc-emerald-mid); background: rgba(46,107,90,0.35);
        }
        lc-avatar .chip:active { transform: scale(0.97); }
        lc-avatar .guidance {
          background: rgba(255,255,255,0.06); border: 1px solid rgba(127,212,188,0.35);
          border-radius: var(--lc-radius); padding: 18px 22px; width: 100%;
        }
        lc-avatar .guidance ul { list-style: none; margin: 0; padding: 0; }
        lc-avatar .guidance li {
          padding: 7px 0; font-weight: 700; font-size: 0.98rem;
        }
        lc-avatar .guidance li::before { content: '✓'; color: #7fd4bc; margin-right: 10px; font-weight: 800; }
        lc-avatar form.inline { display: flex; gap: 10px; width: 100%; }
        lc-avatar input, lc-avatar select {
          flex: 1; width: 100%; padding: 14px 16px;
          font-family: var(--lc-font); font-size: 1rem;
          border: 0; border-radius: 12px; background: var(--lc-white); color: var(--lc-ink);
        }
        lc-avatar select:invalid { color: var(--lc-gray); }
        lc-avatar input:focus, lc-avatar select:focus { outline: 2px solid var(--lc-cta); }
        lc-avatar .send {
          border: 0; border-radius: 12px; padding: 14px 24px;
          background: linear-gradient(180deg, var(--lc-cta), var(--lc-cta-dark));
          color: var(--lc-white); font-family: var(--lc-font); font-weight: 800; font-size: 1rem;
          cursor: pointer; white-space: nowrap;
        }
        lc-avatar .send:hover { background: var(--lc-cta-dark); }
        lc-avatar .skip {
          background: none; border: 0; color: rgba(255,255,255,0.6);
          font-family: var(--lc-font); font-weight: 700; font-size: 0.92rem;
          cursor: pointer; text-decoration: underline;
        }
        lc-avatar .skip:hover { color: var(--lc-white); }
        lc-avatar .foot {
          text-align: center; font-size: 0.68rem; line-height: 1.5;
          color: rgba(255,255,255,0.4);
        }
        lc-avatar .err { color: #f0b03c; font-weight: 700; font-size: 0.9rem; min-height: 1.2em; margin: 0; }
        lc-avatar .legal {
          font-size: 0.7rem; line-height: 1.5; color: rgba(255,255,255,0.55);
          max-width: 46em; text-align: center; margin: 0;
        }
        lc-avatar .actions { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
        /* A pinned bottom band, split evenly between the answer controls above
           and the footer below: WhatsApp centered in that gap, footer at the
           very bottom. Fixed height so neither moves when controls change. */
        lc-avatar .bottom-band {
          position: absolute; left: 20px; right: 20px; bottom: 0; height: 140px;
          display: flex; flex-direction: column; align-items: center; justify-content: space-between;
          padding-bottom: 14px;
        }
        @media (max-width: 520px) {
          lc-avatar form.inline { flex-direction: column; }
          lc-avatar .chip { padding: 13px 20px; }
          lc-avatar .bottom-band { height: 190px; } /* wrapped disclaimer */
        }
      </style>
      <section class="stage">
        ${banner ? '' : `
          <div class="lang-wrap">
            <button class="lang" aria-label="Language" aria-haspopup="true">
              ${LANG_META[lang].flag} ${lang.toUpperCase()}
            </button>
            <div class="lang-menu">
              ${LANGS.map((l) => `
                <button type="button" data-lang="${l}" aria-current="${l === lang}">
                  ${LANG_META[l].flag} ${LANG_META[l].label}
                </button>
              `).join('')}
            </div>
          </div>
        `}
        ${this.spriteTitle
          ? `<div class="mark-stack">
              <img class="mark mark-mini" src="/assets/logo/13.png" alt="${LC.brandName}" />
              <img class="mark mark-word" src="/assets/logo/legal-connections-wordmark.png" alt="${LC.brandName}" />
            </div>`
          : `<div class="sub">${t(this.presetTitle || strings.sub)}</div>`}
        <canvas class="orb" aria-hidden="true"></canvas>
        <div class="caption" aria-live="polite"></div>
        <div class="controls"></div>
        ${banner ? '' : `
          <div class="bottom-band">
            <lc-chat></lc-chat>
            <div class="foot">© ${new Date().getFullYear()} ${LC.brandName}. ${t(strings.rights)} · ${t(strings.disclaimer)}</div>
          </div>
        `}
      </section>
    `;
    const langMenu = this.querySelector('.lang-menu');
    if (langMenu) {
      this.querySelector('.lang').addEventListener('click', (e) => {
        e.stopPropagation();
        langMenu.classList.toggle('open');
      });
      langMenu.querySelectorAll('button').forEach((btn) => {
        btn.addEventListener('click', () => setLang(btn.dataset.lang));
      });
      document.addEventListener('click', () => langMenu.classList.remove('open'));
    }
    this.face = new ParticleField(this.querySelector('canvas.orb'), {
      mode: this.mode,
      skipAssembly: this._assembledOnce, // re-renders (language switch) skip the intro
      logoText: this.spriteTitle ? t(this.presetSpriteTitle || strings.sub) : null,
    });
    this.face.ready.then(() => { this._assembledOnce = true; });
    this.face.start();
  }

  /* -------- caption typing -------- */
  type(text, done) {
    const el = this.querySelector('.caption');
    clearInterval(this._typeTimer);
    if (this.reducedMotion) {
      el.textContent = text;
      done?.();
      return;
    }
    this.face.setSpeaking(true);
    let i = 0;
    const tick = () => {
      i++;
      el.innerHTML = `${escapeHtml(text.slice(0, i))}<span class="cursor"></span>`;
      if (i >= text.length) {
        clearInterval(this._typeTimer);
        el.textContent = text;
        this.face.setSpeaking(false);
        done?.();
      }
    };
    this._typeTimer = setInterval(tick, 24);
  }

  /* -------- progressive save: POST once, PATCH afterwards -------- */
  async save() {
    const payload = { ...this.lead, language: getLang(), source: 'avatar-intake' };
    try {
      if (!this.leadId) {
        const res = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const body = await res.json();
        if (res.ok && body.ok) this.leadId = body.id;
      } else {
        await fetch(`/api/leads/${this.leadId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
    } catch {
      // Tolerated: the payload is cumulative, so the next save retries everything.
    }
  }

  /* -------- conversation flow -------- */
  advance(value) {
    // Every answer flips the sprites between the logo and the orb.
    this.mode = this.mode === 'orb' ? 'logo' : 'orb';
    this.face.toggle();
    switch (this.stepId) {
      case 'accident':
        this.branch = value === 'yes' ? 'accident' : 'other';
        this.stepId = 'caseType';
        break;
      case 'caseType':
        this.lead.caseType = value;
        this.save();
        this.stepId = this.branch === 'accident' ? 'when' : 'guidance';
        break;
      case 'when':
        // '0'..'14' days ago becomes a concrete date; anything older is flagged.
        this.lead.accidentDate = /^\d+$/.test(value)
          ? new Date(Date.now() - Number(value) * 86400000).toISOString().slice(0, 10)
          : 'over-14-days';
        this.save();
        this.stepId = 'injured';
        break;
      case 'injured':
        this.lead.injured = value;
        this.save();
        this.stepId = 'police';
        break;
      case 'police':
        this.lead.policeResponded = value;
        this.save();
        this.stepId = 'fault';
        break;
      case 'fault':
        this.lead.faultBelief = value;
        this.save();
        this.stepId = 'insurance';
        break;
      case 'insurance':
        this.lead.spokeWithInsurance = value;
        this.save();
        this.stepId = 'guidance';
        break;
      case 'guidance':
        this.stepId = 'name';
        break;
      case 'name':
        this.lead.name = value;
        this.save();
        this.stepId = 'phone';
        break;
      case 'phone':
        this.lead.phone = value;
        this.lead.consent = true; // consent granted by sending the number; legalese shown with the input
        this.save();
        this.stepId = 'email';
        break;
      case 'email':
        this.lead.email = value;
        this.save();
        this.stepId = 'languagePref';
        break;
      case 'languagePref':
        this.lead.preferredLanguage = value;
        this.save();
        this.stepId = 'done';
        // Switching the site language re-renders us via onLangChange.
        if (value !== getLang()) { setLang(value); return; }
        break;
    }
    this.showStep();
  }

  showStep(instant = false) {
    const controls = this.querySelector('.controls');
    controls.classList.remove('show');
    controls.innerHTML = '';

    const show = (caption, buildControls) => {
      const reveal = () => {
        buildControls();
        requestAnimationFrame(() => controls.classList.add('show'));
      };
      if (instant) {
        this.querySelector('.caption').textContent = caption;
        reveal();
      } else {
        this.type(caption, reveal);
      }
    };

    const yesNo = [
      { value: 'yes', label: strings.yes },
      { value: 'no', label: strings.no },
    ];
    const yesNoUnsure = [...yesNo, { value: 'not-sure', label: strings.notSure }];

    switch (this.stepId) {
      case 'accident':
        show(`${t(strings.qAccident)}`, () => {
          this.chips(controls, yesNo);
        });
        break;

      case 'caseType': {
        const isAccident = this.branch === 'accident';
        show(t(isAccident ? strings.qWhat : strings.qCaseOther), () => {
          this.chips(controls, isAccident ? strings.whatTypes : strings.otherTypes);
        });
        break;
      }

      case 'when': {
        const options = [];
        for (let n = 0; n <= 14; n++) {
          const label =
            n === 0 ? t(strings.whenToday)
            : n === 1 ? t(strings.whenYesterday)
            : t(strings.whenDaysAgo).replace('{n}', n);
          options.push({ value: String(n), label });
        }
        options.push({ value: 'over-14', label: t(strings.whenOver14) });
        show(t(strings.qWhen), () => {
          this.selectInput(controls, { options, placeholder: t(strings.whenPlaceholder) });
        });
        break;
      }

      case 'injured':
        show(t(strings.qInjured), () => this.chips(controls, yesNoUnsure));
        break;

      case 'police':
        show(t(strings.qPolice), () => this.chips(controls, yesNoUnsure));
        break;

      case 'fault':
        show(t(strings.qFault), () => this.chips(controls, strings.faultOptions));
        break;

      case 'insurance':
        show(t(strings.qInsurance), () => this.chips(controls, yesNo));
        break;

      case 'guidance': {
        const isAccident = this.branch === 'accident';
        const items = this.guidanceItems();
        show(t(isAccident ? strings.guidanceIntro : strings.guidanceIntroOther), () => {
          const panel = document.createElement('div');
          panel.className = 'guidance';
          panel.innerHTML = `<ul>${items.map((i) => `<li>${t(i)}</li>`).join('')}</ul>`;
          controls.appendChild(panel);
          this.chips(controls, [{ value: 'continue', label: strings.getConnected }]);
        });
        break;
      }

      case 'name':
        show(t(strings.qName), () => {
          this.textInput(controls, {
            placeholder: t(strings.namePlaceholder),
            autocomplete: 'name',
            validate: (v) => (v ? null : t(strings.errName)),
          });
        });
        break;

      case 'phone':
        show(t(strings.qPhone).replace('{name}', this.firstName()), () => {
          this.textInput(controls, {
            type: 'tel',
            placeholder: t(strings.phonePlaceholder),
            autocomplete: 'tel',
            legal: t(strings.legal),
            validate: (v) => (v.replace(/[^\d+]/g, '').length >= 7 ? null : t(strings.errPhone)),
          });
        });
        break;

      case 'email':
        show(t(strings.qEmail), () => {
          this.textInput(controls, {
            type: 'email',
            placeholder: t(strings.emailPlaceholder),
            autocomplete: 'email',
            validate: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : t(strings.errEmail)),
          });
        });
        break;

      case 'languagePref':
        show(t(strings.qLang), () => this.chips(controls, strings.languages));
        break;

      case 'done':
        this.finish(controls, show);
        break;
    }
  }

  // Personalized guidance per the concept: useful feedback before contact info.
  guidanceItems() {
    if (this.branch !== 'accident') {
      return [
        strings.guidanceItems.genericAttorneys,
        strings.guidanceItems.genericMedical,
        strings.guidanceItems.genericFree,
      ];
    }
    const items = [];
    if (this.lead.injured === 'yes' || this.lead.injured === 'not-sure') {
      items.push(strings.guidanceItems.medical);
    }
    if (this.lead.injured === 'yes') {
      items.push(strings.guidanceItems.wages, strings.guidanceItems.pain);
    }
    const vehicle = ['car-accident', 'truck-accident', 'motorcycle-accident', 'rideshare-accident', 'hit-and-run'];
    if (vehicle.includes(this.lead.caseType)) {
      items.push(strings.guidanceItems.rental, strings.guidanceItems.property);
    }
    if (!items.length) {
      items.push(
        strings.guidanceItems.genericAttorneys,
        strings.guidanceItems.genericFree,
      );
    }
    return items;
  }

  async finish(controls, show) {
    if (!this.leadId) await this.save(); // last chance if earlier saves failed
    const template = this.leadId ? strings.done : strings.doneNoSave;
    const caption = t(template).replace('{name}', this.firstName());
    const waText = encodeURIComponent(t(strings.whatsappGreeting));
    show(caption, () => {
      controls.innerHTML = `
        <div class="actions">
          <a class="lc-btn lc-btn--cta" href="${LC.phoneHref}">${t(strings.callNow)} ${LC.phoneDisplay}</a>
          <a class="lc-btn lc-btn--ghost" href="https://wa.me/${LC.whatsappNumber}?text=${waText}" target="_blank" rel="noopener">${t(strings.whatsapp)}</a>
        </div>
        <button class="skip" type="button">${t(strings.restart)}</button>
      `;
      controls.querySelector('.skip').addEventListener('click', () => {
        const preset = CASE_PRESETS[this.getAttribute('case')];
        this.stepId = preset ? (preset.branch === 'accident' ? 'when' : 'guidance') : 'accident';
        this.branch = preset?.branch || null;
        this.lead = preset ? { caseType: preset.caseType } : {};
        this.leadId = null;
        this.mode = 'logo';
        if (this.face.target !== 0) this.face.toggle();
        this.showStep();
      });
    });
  }

  /* -------- control builders -------- */
  chips(controls, options) {
    const wrap = document.createElement('div');
    wrap.className = 'chips';
    wrap.innerHTML = options
      .map((o) => `<button type="button" class="chip" data-value="${o.value}">${t(o.label)}</button>`)
      .join('');
    wrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.chip');
      if (btn) this.advance(btn.dataset.value);
    });
    controls.appendChild(wrap);
  }

  textInput(controls, opts) {
    const form = document.createElement('form');
    form.className = 'inline';
    form.noValidate = true;
    form.innerHTML = `
      <input
        type="${opts.type || 'text'}"
        placeholder="${opts.placeholder}"
        aria-label="${opts.placeholder}"
        ${opts.autocomplete ? `autocomplete="${opts.autocomplete}"` : ''}
      />
      <button type="submit" class="send">${t(strings.send)}</button>
    `;
    const err = document.createElement('p');
    err.className = 'err';
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = form.querySelector('input').value.trim();
      if (!value && opts.skippable) {
        this.advance('');
        return;
      }
      const error = opts.validate ? opts.validate(value) : null;
      if (error) {
        err.textContent = error;
        return;
      }
      if (!value) return;
      err.textContent = '';
      this.advance(value);
    });
    controls.appendChild(form);
    controls.appendChild(err);
    if (opts.legal) {
      const legal = document.createElement('p');
      legal.className = 'legal';
      legal.textContent = opts.legal;
      controls.appendChild(legal);
    }
    if (opts.skippable) this.skipButton(controls);
    form.querySelector('input').focus();
  }

  selectInput(controls, { options, placeholder }) {
    const form = document.createElement('form');
    form.className = 'inline';
    form.innerHTML = `
      <select required aria-label="${placeholder}">
        <option value="" selected disabled>${placeholder}</option>
        ${options.map((o) => `<option value="${o.value}">${o.label}</option>`).join('')}
      </select>
      <button type="submit" class="send">${t(strings.send)}</button>
    `;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const value = form.querySelector('select').value;
      if (value) this.advance(value);
    });
    controls.appendChild(form);
  }

  skipButton(controls) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'skip';
    btn.textContent = t(strings.skip);
    btn.addEventListener('click', () => this.advance(''));
    controls.appendChild(btn);
  }
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

customElements.define('lc-avatar', LcAvatar);
