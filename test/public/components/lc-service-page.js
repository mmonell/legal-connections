import { LC } from '../config.js';
import { t, onLangChange } from '../i18n.js';
import './lc-avatar.js';
import './lc-hero.js';
import './lc-steps.js';
import './lc-why.js';
import './lc-team.js';

const shared = {
  callNow: { en: 'Call Now', es: 'Llama Ya', pt: 'Ligue Agora' },
  howWeHelp: { en: 'How We Help', es: 'Cómo Ayudamos', pt: 'Como Ajudamos' },
  bandTitle: {
    en: 'One call connects you. Connected by Trust.',
    es: 'Una llamada te conecta. Conectados por la Confianza.',
    pt: 'Uma ligação te conecta. Conectados pela Confiança.',
  },
  bandSub: {
    en: 'Free to call, free to get connected. English y Español.',
    es: 'Llamar es gratis, conectarte es gratis. English y Español.',
    pt: 'Ligar é grátis, conectar-se é grátis. English, Español e Português.',
  },
};

const services = {
  'auto-accidents': {
    kicker: { en: 'Auto Accidents', es: 'Accidentes de Auto', pt: 'Acidentes de Carro' },
    headline: {
      en: 'Hurt in a Car Accident? Let’s Get You Connected.',
      es: '¿Lesionado en un Accidente de Auto? Vamos a Conectarte.',
      pt: 'Machucado em um Acidente de Carro? Vamos Te Conectar.',
    },
    sub: {
      en: 'From fender benders to serious collisions, we match you with trusted attorneys who handle auto accident cases every day, plus the medical care you need to recover.',
      es: 'Desde choques leves hasta colisiones serias, te conectamos con abogados de confianza que manejan casos de accidentes de auto todos los días, además de la atención médica que necesitas para recuperarte.',
      pt: 'De batidas leves a colisões graves, te conectamos com advogados de confiança que lidam com casos de acidentes de carro todos os dias, além do atendimento médico que você precisa para se recuperar.',
    },
    helpTitle: { en: 'Cases we connect for', es: 'Casos para los que te conectamos', pt: 'Casos para os quais conectamos você' },
    bullets: [
      { en: 'Car accidents', es: 'Accidentes de auto', pt: 'Acidentes de carro' },
      { en: 'Motorcycle accidents', es: 'Accidentes de motora', pt: 'Acidentes de moto' },
      { en: 'Truck accidents', es: 'Accidentes de camión', pt: 'Acidentes de caminhão' },
      { en: 'Rideshare accidents (Uber/Lyft)', es: 'Accidentes de rideshare (Uber/Lyft)', pt: 'Acidentes de aplicativo (Uber/Lyft)' },
      { en: 'Hit-and-run and uninsured drivers', es: 'Conductores que huyen o sin seguro', pt: 'Motoristas que fogem ou sem seguro' },
      { en: 'Injured passengers and pedestrians', es: 'Pasajeros y peatones lesionados', pt: 'Passageiros e pedestres feridos' },
    ],
    extra: {
      en: 'Need a doctor too? Our medical network can get you evaluated and treated while your attorney handles the case.',
      es: '¿También necesitas un médico? Nuestra red médica puede evaluarte y tratarte mientras tu abogado maneja el caso.',
      pt: 'Também precisa de um médico? Nossa rede médica pode avaliá-lo e tratá-lo enquanto seu advogado cuida do caso.',
    },
  },
  'personal-injury': {
    kicker: { en: 'Personal Injury', es: 'Daños Personales', pt: 'Danos Pessoais' },
    headline: {
      en: 'Injured Because of Someone Else’s Negligence?',
      es: '¿Lesionado por la Negligencia de Otra Persona?',
      pt: 'Machucado pela Negligência de Outra Pessoa?',
    },
    sub: {
      en: 'If someone else’s carelessness hurt you, you may have a case. We connect you with trusted personal injury attorneys who will listen and fight for you.',
      es: 'Si el descuido de otra persona te lastimó, podrías tener un caso. Te conectamos con abogados de daños personales de confianza que te escucharán y lucharán por ti.',
      pt: 'Se o descuido de outra pessoa te machucou, você pode ter um caso. Te conectamos com advogados de confiança especializados em danos pessoais que vão te ouvir e lutar por você.',
    },
    helpTitle: { en: 'Cases we connect for', es: 'Casos para los que te conectamos', pt: 'Casos para os quais conectamos você' },
    bullets: [
      { en: 'Slip & fall and trip & fall', es: 'Resbalones, tropiezos y caídas', pt: 'Escorregões, tropeços e quedas' },
      { en: 'Premises liability (unsafe properties)', es: 'Responsabilidad de locales (propiedades inseguras)', pt: 'Responsabilidade predial (propriedades inseguras)' },
      { en: 'Dog bites', es: 'Mordidas de perro', pt: 'Mordidas de cachorro' },
      { en: 'Defective products', es: 'Productos defectuosos', pt: 'Produtos defeituosos' },
      { en: 'Medical malpractice', es: 'Negligencia médica', pt: 'Negligência médica' },
      { en: 'Wrongful death', es: 'Muerte injusta', pt: 'Morte injusta' },
    ],
    extra: {
      en: 'Not sure if your situation counts? Call us. Telling us what happened costs nothing.',
      es: '¿No sabes si tu situación cuenta? Llámanos. Contarnos lo que pasó no cuesta nada.',
      pt: 'Não tem certeza se sua situação se qualifica? Ligue para nós. Contar o que aconteceu não custa nada.',
    },
  },
  'workers-comp': {
    kicker: { en: 'Workers’ Compensation', es: 'Compensación Laboral', pt: 'Indenização Trabalhista' },
    headline: {
      en: 'Hurt on the Job? You Have Rights.',
      es: '¿Lesionado en el Trabajo? Tienes Derechos.',
      pt: 'Machucado no Trabalho? Você Tem Direitos.',
    },
    sub: {
      en: 'A work injury can put your paycheck and your health at risk. We connect you with attorneys who help injured workers get the benefits and treatment they are owed.',
      es: 'Una lesión en el trabajo puede poner en riesgo tu salario y tu salud. Te conectamos con abogados que ayudan a trabajadores lesionados a obtener los beneficios y el tratamiento que les corresponden.',
      pt: 'Uma lesão no trabalho pode colocar em risco seu salário e sua saúde. Te conectamos com advogados que ajudam trabalhadores lesionados a conseguir os benefícios e o tratamento que merecem.',
    },
    helpTitle: { en: 'Situations we connect for', es: 'Situaciones para las que te conectamos', pt: 'Situações para as quais conectamos você' },
    bullets: [
      { en: 'Construction and industrial injuries', es: 'Lesiones en construcción e industria', pt: 'Lesões na construção e na indústria' },
      { en: 'Lifting, repetitive stress, and overuse injuries', es: 'Lesiones por cargar, esfuerzo repetitivo y sobreuso', pt: 'Lesões por levantamento de peso, esforço repetitivo e uso excessivo' },
      { en: 'Denied or delayed claims', es: 'Reclamaciones negadas o atrasadas', pt: 'Reivindicações negadas ou atrasadas' },
      { en: 'Lost wages and reduced hours after an injury', es: 'Salarios perdidos y horas reducidas tras una lesión', pt: 'Salários perdidos e horas reduzidas após uma lesão' },
      { en: 'Access to medical treatment', es: 'Acceso a tratamiento médico', pt: 'Acesso a tratamento médico' },
      { en: 'Fear of retaliation for reporting', es: 'Miedo a represalias por reportar', pt: 'Medo de represálias ao reportar' },
    ],
    extra: {
      en: 'Your immigration status does not erase your workplace rights. Ask us, confidentially.',
      es: 'Tu estatus migratorio no borra tus derechos laborales. Pregúntanos, de forma confidencial.',
      pt: 'Seu status migratório não apaga seus direitos trabalhistas. Pergunte a nós, de forma confidencial.',
    },
  },
  immigration: {
    kicker: { en: 'Immigration', es: 'Inmigración', pt: 'Imigração' },
    headline: {
      en: 'Your Immigration Journey, Guided by Trust.',
      es: 'Tu Proceso de Inmigración, Guiado por la Confianza.',
      pt: 'Sua Jornada de Imigração, Guiada pela Confiança.',
    },
    sub: {
      en: 'Immigration processes are stressful and the stakes are high. We connect you with trusted immigration attorneys who explain your options clearly, in your language.',
      es: 'Los procesos de inmigración son estresantes y hay mucho en juego. Te conectamos con abogados de inmigración de confianza que te explican tus opciones con claridad, en tu idioma.',
      pt: 'Os processos de imigração são estressantes e há muito em jogo. Te conectamos com advogados de imigração de confiança que explicam suas opções com clareza, no seu idioma.',
    },
    helpTitle: { en: 'Matters we connect for', es: 'Asuntos para los que te conectamos', pt: 'Assuntos para os quais conectamos você' },
    bullets: [
      { en: 'Family petitions', es: 'Peticiones familiares', pt: 'Petições familiares' },
      { en: 'Work visas and permits', es: 'Visas y permisos de trabajo', pt: 'Vistos e permissões de trabalho' },
      { en: 'Residency (green card)', es: 'Residencia (green card)', pt: 'Residência (green card)' },
      { en: 'Citizenship and naturalization', es: 'Ciudadanía y naturalización', pt: 'Cidadania e naturalização' },
      { en: 'Humanitarian relief (asylum, TPS, U-Visa)', es: 'Alivio humanitario (asilo, TPS, Visa U)', pt: 'Alívio humanitário (asilo, TPS, Visto U)' },
      { en: 'Deportation defense', es: 'Defensa contra deportación', pt: 'Defesa contra deportação' },
    ],
    extra: {
      en: 'Every conversation is confidential. We are here to connect you, not to judge you.',
      es: 'Cada conversación es confidencial. Estamos aquí para conectarte, no para juzgarte.',
      pt: 'Toda conversa é confidencial. Estamos aqui para te conectar, não para te julgar.',
    },
  },
};

class LcServicePage extends HTMLElement {
  connectedCallback() {
    this.render();
    onLangChange(this, () => this.render());
  }

  render() {
    const slug = this.getAttribute('service');
    const s = services[slug];
    if (!s) {
      this.innerHTML = '<p style="padding:40px">Unknown service.</p>';
      return;
    }
    const noAvatar = this.hasAttribute('no-avatar'); // static landing pages: skip the sprite banner
    this.innerHTML = `
      <style>
        lc-service-page .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        lc-service-page .item {
          background: var(--lc-white); border-radius: var(--lc-radius);
          padding: 22px; box-shadow: var(--lc-shadow);
          font-weight: 700; display: flex; gap: 10px; align-items: flex-start;
        }
        lc-service-page .item::before { content: '✓'; color: var(--lc-cta); font-weight: 800; }
        lc-service-page .extra {
          margin-top: 28px; padding: 20px 24px;
          background: var(--lc-white); border-left: 4px solid var(--lc-cta);
          border-radius: 0 var(--lc-radius) var(--lc-radius) 0;
          box-shadow: var(--lc-shadow); max-width: 56em;
        }
        lc-service-page .band { text-align: center; }
        lc-service-page .band h2 { font-size: clamp(1.5rem, 3vw, 2.1rem); font-weight: 800; }
        lc-service-page .band p { color: rgba(255,255,255,0.75); margin: 0 0 26px; }
        @media (max-width: 820px) { lc-service-page .grid { grid-template-columns: 1fr; } }
      </style>

      ${noAvatar ? '' : `<lc-avatar id="evaluation" banner case="${slug}"></lc-avatar>`}

      ${noAvatar ? '<lc-steps></lc-steps>' : ''}

      <section class="lc-section lc-section--light">
        <div class="lc-container">
          <div class="lc-kicker">${t(shared.howWeHelp)}</div>
          <h2 class="lc-h2">${t(s.helpTitle)}</h2>
          <div class="grid">
            ${s.bullets.map((b) => `<div class="item"><span>${t(b)}</span></div>`).join('')}
          </div>
          <div class="extra">${t(s.extra)}</div>
        </div>
      </section>

      ${noAvatar ? '<lc-why></lc-why><lc-team></lc-team>' : ''}

      <section class="lc-section lc-section--dark band">
        <div class="lc-container">
          <h2>${t(shared.bandTitle)}</h2>
          <p>${t(shared.bandSub)}</p>
          <a class="lc-btn lc-btn--cta" href="${LC.phoneHref}">${t(shared.callNow)} ${LC.phoneDisplay}</a>
        </div>
      </section>

      ${noAvatar ? '' : `<lc-hero service="${slug}"></lc-hero>`}
    `;
  }
}

customElements.define('lc-service-page', LcServicePage);
