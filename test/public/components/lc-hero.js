import { LC } from '../config.js';
import { t, getLang, onLangChange } from '../i18n.js';
import { floridaCities, floridaCounties } from '../data/florida.js';

const strings = {
  kicker: { en: 'Accident Injury Referrals', es: 'Referidos por Accidentes', pt: 'Indicações por Acidentes' },
  headline: {
    en: 'Injured in an Accident?',
    es: '¿Lesionado en un Accidente?',
    pt: 'Sofreu Lesões em um Acidente?',
  },
  sub: {
    en: 'Tell us what happened and we match you with a trusted attorney and the medical care you need at no cost to you.',
    es: 'Cuéntanos qué pasó y te conectamos con un abogado de confianza y la atención médica que necesitas sin costo para ti.',
    pt: 'Conte-nos o que aconteceu e te conectamos com um advogado de confiança e o atendimento médico que você precisa, sem custo algum.',
  },
  call: { en: 'Or call', es: 'O llama al', pt: 'Ou ligue para' },
  trust: [
    { en: 'Available 24/7', es: 'Disponibles 24/7', pt: 'Disponível 24/7' },
    { en: 'No cost to get connected', es: 'Conectarte no cuesta nada', pt: 'Conectar-se não custa nada' },
    { en: 'English & Español', es: 'English y Español', pt: 'English, Español e Português' },
  ],
  form: {
    title: { en: "It's Easy to Get Started.", es: 'Es Fácil Comenzar.', pt: 'É Fácil Começar.' },
    firstName: { en: 'First Name', es: 'Nombre', pt: 'Nome' },
    lastName: { en: 'Last Name', es: 'Apellido', pt: 'Sobrenome' },
    phone: { en: 'Phone Number', es: 'Número de Teléfono', pt: 'Número de Telefone' },
    email: { en: 'E-mail', es: 'Correo Electrónico', pt: 'E-mail' },
    city: { en: '- Accident Location (City) -', es: '- Lugar del Accidente (Ciudad) -', pt: '- Local do Acidente (Cidade) -' },
    county: { en: '- County of Accident -', es: '- Condado del Accidente -', pt: '- Condado do Acidente -' },
    countySuffix: { en: 'County', es: 'Condado', pt: 'Condado' },
    preferredLanguage: { en: '- Preferred Language -', es: '- Idioma Preferido -', pt: '- Idioma Preferido -' },
    languages: [
      { value: 'en', label: { en: 'English', es: 'English (Inglés)', pt: 'English (Inglês)' } },
      { value: 'es', label: { en: 'Spanish (Español)', es: 'Español', pt: 'Espanhol (Español)' } },
      { value: 'pt', label: { en: 'Portuguese (Português)', es: 'Portugués (Português)', pt: 'Português' } },
    ],
    caseType: { en: '- Case Type -', es: '- Tipo de Caso -', pt: '- Tipo de Caso -' },
    // forthepeople.com "Case Type" list, plus our own vehicle cases after Car Accident.
    caseTypes: [
      { value: 'car-accident', label: { en: 'Car Accident', es: 'Accidente de Auto', pt: 'Acidente de Carro' } },
      { value: 'motorcycle-accident', label: { en: 'Motorcycle Accident', es: 'Accidente de Motora', pt: 'Acidente de Moto' } },
      { value: 'truck-accident', label: { en: 'Truck Accident', es: 'Accidente de Camión', pt: 'Acidente de Caminhão' } },
      { value: 'rideshare-accident', label: { en: 'Rideshare Accident (Uber/Lyft)', es: 'Accidente de Rideshare (Uber/Lyft)', pt: 'Acidente de Aplicativo (Uber/Lyft)' } },
      { value: 'slip-and-fall', label: { en: 'Slip & Fall', es: 'Resbalón y Caída', pt: 'Escorregão e Queda' } },
      { value: 'workers-comp', label: { en: "Workers' Compensation", es: 'Compensación Laboral', pt: 'Indenização Trabalhista' } },
      { value: 'airbag-injury', label: { en: 'Airbag Injury', es: 'Lesión por Airbag', pt: 'Lesão por Airbag' } },
      { value: 'birth-injury', label: { en: 'Birth Injury', es: 'Lesión de Parto', pt: 'Lesão de Parto' } },
      { value: 'business-dispute', label: { en: 'Business Dispute', es: 'Disputa Comercial', pt: 'Disputa Comercial' } },
      { value: 'carbon-monoxide', label: { en: 'Carbon Monoxide Exposure', es: 'Exposición a Monóxido de Carbono', pt: 'Exposição a Monóxido de Carbono' } },
      { value: 'child-sexual-abuse', label: { en: 'Child Sexual Abuse', es: 'Abuso Sexual Infantil', pt: 'Abuso Sexual Infantil' } },
      { value: 'class-action', label: { en: 'Class Action', es: 'Demanda Colectiva', pt: 'Ação Coletiva' } },
      { value: 'data-breach', label: { en: 'Data Breach', es: 'Filtración de Datos', pt: 'Vazamento de Dados' } },
      { value: 'defective-products', label: { en: 'Defective Products', es: 'Productos Defectuosos', pt: 'Produtos Defeituosos' } },
      { value: 'depo-provera', label: { en: 'Depo-Provera', es: 'Depo-Provera', pt: 'Depo-Provera' } },
      { value: 'dexcom-recall', label: { en: 'Dexcom Recall', es: 'Retiro de Dexcom', pt: 'Recall da Dexcom' } },
      { value: 'fire-injury', label: { en: 'Fire Injury', es: 'Lesión por Incendio', pt: 'Lesão por Incêndio' } },
      { value: 'gm-transmission', label: { en: 'GM Transmission Issue', es: 'Problema de Transmisión GM', pt: 'Problema de Transmissão GM' } },
      { value: 'grok-ai', label: { en: 'Grok AI', es: 'Grok AI', pt: 'Grok AI' } },
      { value: 'hair-color', label: { en: 'Hair Color', es: 'Tinte de Cabello', pt: 'Tintura de Cabelo' } },
      { value: 'hair-relaxer', label: { en: 'Hair Relaxer', es: 'Alisador de Cabello', pt: 'Alisante de Cabelo' } },
      { value: 'medical-malpractice', label: { en: 'Medical Malpractice', es: 'Negligencia Médica', pt: 'Negligência Médica' } },
      { value: 'mesothelioma', label: { en: 'Mesothelioma', es: 'Mesotelioma', pt: 'Mesotelioma' } },
      { value: 'nursing-home', label: { en: 'Nursing Home', es: 'Hogar de Ancianos', pt: 'Casa de Repouso' } },
      { value: 'other', label: { en: 'Other', es: 'Otro', pt: 'Outro' } },
      { value: 'sex-trafficking', label: { en: 'Sex Trafficking', es: 'Trata Sexual', pt: 'Tráfico Sexual' } },
      { value: 'sexual-abuse', label: { en: 'Sexual Abuse', es: 'Abuso Sexual', pt: 'Abuso Sexual' } },
      { value: 'social-media-harm', label: { en: 'Social Media Harm', es: 'Daño por Redes Sociales', pt: 'Dano por Redes Sociais' } },
      { value: 'social-security', label: { en: 'Social Security', es: 'Seguro Social', pt: 'Seguridade Social' } },
      { value: 'talcum-powder', label: { en: 'Talcum Powder', es: 'Talco', pt: 'Talco' } },
      { value: 'tcpa-prerecorded-call', label: { en: 'TCPA Pre-Recorded Call', es: 'Llamada Pregrabada (TCPA)', pt: 'Chamada Pré-Gravada (TCPA)' } },
      { value: 'toxic-airplane-fumes', label: { en: 'Toxic Airplane Fumes', es: 'Vapores Tóxicos de Avión', pt: 'Vapores Tóxicos de Avião' } },
      { value: 'trip-and-fall', label: { en: 'Trip & Fall', es: 'Tropiezo y Caída', pt: 'Tropeço e Queda' } },
      { value: 'trudi-navigation', label: { en: 'Trudi Navigation System', es: 'Sistema de Navegación Trudi', pt: 'Sistema de Navegação Trudi' } },
      { value: 'ultra-processed-foods', label: { en: 'Ultra Processed Foods', es: 'Alimentos Ultraprocesados', pt: 'Alimentos Ultraprocessados' } },
      { value: 'unpaid-wages', label: { en: 'Unpaid Wages/Earnings', es: 'Salarios No Pagados', pt: 'Salários Não Pagos' } },
      { value: 'veteran-disability', label: { en: 'Veteran Disability', es: 'Discapacidad de Veteranos', pt: 'Invalidez de Veteranos' } },
      { value: 'weight-loss-drug', label: { en: 'Weight Loss Drug', es: 'Medicamento para Perder Peso', pt: 'Medicamento para Emagrecer' } },
    ],
    describe: { en: 'Please describe what happened', es: 'Por favor describe lo que pasó', pt: 'Por favor, descreva o que aconteceu' },
    legal1: {
      en: 'By submitting my phone number above I authorize Legal Connections, and its service providers, to contact me by phone call, text message, or WhatsApp at the number submitted. Consent is not a condition to receive services. Msg frequency varies. Msg & data rates may apply. Upon receipt of any message, reply STOP to unsubscribe.',
      es: 'Al enviar mi número de teléfono autorizo a Legal Connections, y a sus proveedores de servicio, a contactarme por llamada, mensaje de texto o WhatsApp al número indicado. El consentimiento no es una condición para recibir servicios. La frecuencia de mensajes varía. Pueden aplicar tarifas de mensajes y datos. Al recibir cualquier mensaje, responde STOP para cancelar.',
      pt: 'Ao enviar meu número de telefone acima, autorizo a Legal Connections, e seus prestadores de serviço, a me contatar por ligação, mensagem de texto ou WhatsApp no número informado. O consentimento não é uma condição para receber serviços. A frequência de mensagens varia. Podem ser aplicadas tarifas de mensagem e dados. Ao receber qualquer mensagem, responda STOP para cancelar.',
    },
    legal2: {
      en: 'By submitting this form, you agree to our Terms & acknowledge our privacy policy.',
      es: 'Al enviar este formulario, aceptas nuestros Términos y reconoces nuestra política de privacidad.',
      pt: 'Ao enviar este formulário, você concorda com nossos Termos e reconhece nossa política de privacidade.',
    },
    submit: { en: 'See if you qualify', es: 'Mira si calificas', pt: 'Veja se você qualifica' },
    sending: { en: 'Sending…', es: 'Enviando…', pt: 'Enviando…' },
    success: {
      en: 'Thank you! We received your case and will contact you shortly.',
      es: '¡Gracias! Recibimos tu caso y te contactaremos pronto.',
      pt: 'Obrigado! Recebemos seu caso e entraremos em contato em breve.',
    },
    error: {
      en: 'We could not send your request. Please try again or call us at',
      es: 'No pudimos enviar tu solicitud. Intenta de nuevo o llámanos al',
      pt: 'Não conseguimos enviar sua solicitação. Tente novamente ou ligue para nós no',
    },
  },
};

// Per-service copy + pre-selected case type, used when lc-hero is embedded on
// a service page (attribute `service="<slug>"`) instead of the homepage.
const SERVICE_OVERRIDES = {
  'auto-accidents': {
    kicker: { en: 'Auto Accidents', es: 'Accidentes de Auto', pt: 'Acidentes de Carro' },
    headline: { en: 'Hurt in a Car Accident?', es: '¿Lesionado en un Accidente de Auto?', pt: 'Machucado em um Acidente de Carro?' },
    sub: {
      en: 'Tell us what happened and we match you with a trusted attorney who handles auto accident cases every day, plus the medical care you need at no cost to you.',
      es: 'Cuéntanos qué pasó y te conectamos con un abogado de confianza que maneja casos de accidentes de auto, además de la atención médica que necesitas sin costo para ti.',
      pt: 'Conte-nos o que aconteceu e te conectamos com um advogado de confiança que lida com casos de acidentes de carro todos os dias, além do atendimento médico que você precisa, sem custo algum.',
    },
    caseType: 'car-accident',
  },
  'personal-injury': {
    kicker: { en: 'Personal Injury', es: 'Daños Personales', pt: 'Lesões Pessoais' },
    headline: { en: 'Injured Because of Someone Else’s Negligence?', es: '¿Lesionado por la Negligencia de Otra Persona?', pt: 'Sofreu Lesões Pela Negligência de Outra Pessoa?' },
    sub: {
      en: 'Tell us what happened and we match you with a trusted personal injury attorney who will listen and fight for you, at no cost to you.',
      es: 'Cuéntanos qué pasó y te conectamos con un abogado de daños personales de confianza que te escuchará y luchará por ti, sin costo para ti.',
      pt: 'Conte-nos o que aconteceu e te conectamos com um advogado de lesões pessoais de confiança que vai te ouvir e lutar por você, sem custo algum.',
    },
    caseType: 'other', // personal-injury case types (slip & fall, malpractice, etc.) live under "Other" in this form's list
  },
  'workers-comp': {
    kicker: { en: 'Workers’ Compensation', es: 'Compensación Laboral', pt: 'Indenização Trabalhista' },
    headline: { en: 'Hurt on the Job?', es: '¿Lesionado en el Trabajo?', pt: 'Machucado no Trabalho?' },
    sub: {
      en: 'Tell us what happened and we match you with an attorney who helps injured workers get the benefits and treatment they are owed, at no cost to you.',
      es: 'Cuéntanos qué pasó y te conectamos con un abogado que ayuda a trabajadores lesionados a obtener los beneficios y el tratamiento que les corresponden, sin costo para ti.',
      pt: 'Conte-nos o que aconteceu e te conectamos com um advogado que ajuda trabalhadores lesionados a obter os benefícios e o tratamento que merecem, sem custo algum.',
    },
    caseType: 'workers-comp',
  },
  immigration: {
    kicker: { en: 'Immigration', es: 'Inmigración', pt: 'Imigração' },
    headline: { en: 'Need Help With Your Immigration Case?', es: '¿Necesitas Ayuda Con Tu Caso de Inmigración?', pt: 'Precisa de Ajuda Com Seu Caso de Imigração?' },
    sub: {
      en: 'Tell us your situation and we match you with a trusted immigration attorney who explains your options clearly, in your language, at no cost to you.',
      es: 'Cuéntanos tu situación y te conectamos con un abogado de inmigración de confianza que te explica tus opciones con claridad, en tu idioma, sin costo para ti.',
      pt: 'Conte-nos sua situação e te conectamos com um advogado de imigração de confiança que explica suas opções com clareza, no seu idioma, sem custo algum.',
    },
    caseType: 'other',
  },
};

class LcHero extends HTMLElement {
  connectedCallback() {
    this.render();
    onLangChange(this, () => this.render());
  }

  render() {
    const f = strings.form;
    const override = SERVICE_OVERRIDES[this.getAttribute('service')];
    const kicker = override?.kicker || strings.kicker;
    const headline = override?.headline || strings.headline;
    const sub = override?.sub || strings.sub;
    const presetCaseType = override?.caseType || '';
    const topSpacer = this.hasAttribute('top-spacer'); // clears the absolutely-positioned no-nav header on landing pages
    this.innerHTML = `
      <style>
        lc-hero .hero {
          background:
            radial-gradient(1200px 500px at 80% -10%, rgba(255,255,255,0.08), transparent 60%),
            var(--lc-black);
          color: var(--lc-white);
          padding: ${topSpacer ? '128px 0 72px' : '72px 0 72px'};
        }
        lc-hero .inner {
          max-width: var(--lc-max); margin: 0 auto; padding: 0 20px;
          display: grid; grid-template-columns: 1.15fr 1fr; gap: 48px; align-items: center;
        }
        lc-hero .mark { height: 52px; width: auto; margin-bottom: 24px; opacity: 0.95; }
        lc-hero .kicker {
          text-transform: uppercase; letter-spacing: 0.14em;
          font-size: 0.8rem; font-weight: 700; color: var(--lc-cta); margin-bottom: 12px;
        }
        lc-hero h1 { font-size: clamp(2rem, 4.5vw, 3.2rem); font-weight: 800; }
        lc-hero p.sub {
          font-size: clamp(1.02rem, 1.8vw, 1.2rem);
          color: rgba(255,255,255,0.8); margin: 0 0 24px;
        }
        lc-hero .callline { color: rgba(255,255,255,0.85); font-weight: 600; }
        lc-hero .callline a { color: var(--lc-cta); text-decoration: none; font-weight: 800; }
        lc-hero .trust {
          display: flex; gap: 24px; flex-wrap: wrap;
          margin-top: 32px; padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.75); font-weight: 600; font-size: 0.92rem;
        }
        lc-hero .trust span::before { content: '✓'; color: var(--lc-cta); margin-right: 8px; font-weight: 800; }

        lc-hero .card {
          background: var(--lc-charcoal); border-radius: 14px;
          padding: 28px; box-shadow: 0 16px 48px rgba(0,0,0,0.45);
        }
        lc-hero .card h2 { font-size: 1.5rem; font-weight: 800; margin-bottom: 18px; }
        lc-hero .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        lc-hero .card input, lc-hero .card select, lc-hero .card textarea {
          width: 100%; padding: 13px 14px; margin-bottom: 12px;
          font-family: var(--lc-font); font-size: 0.98rem;
          border: 0; border-radius: 10px; background: var(--lc-white); color: var(--lc-ink);
        }
        lc-hero .card select:invalid { color: var(--lc-gray); }
        lc-hero .card input::placeholder, lc-hero .card textarea::placeholder { color: var(--lc-gray); }
        lc-hero .card input:focus, lc-hero .card select:focus, lc-hero .card textarea:focus {
          outline: 2px solid var(--lc-cta);
        }
        lc-hero .card textarea { min-height: 96px; resize: vertical; }
        lc-hero .legal { font-size: 0.72rem; line-height: 1.5; color: rgba(255,255,255,0.6); margin: 4px 0 14px; }
        lc-hero .legal p { margin: 0 0 8px; }
        lc-hero .card button[type=submit] { width: 100%; }
        lc-hero .msg { margin-top: 12px; font-weight: 700; font-size: 0.92rem; }
        lc-hero .msg.ok { color: #7ee2a0; }
        lc-hero .msg.err { color: #ff9d80; }

        @media (max-width: 920px) {
          lc-hero .inner { grid-template-columns: 1fr; gap: 36px; }
          lc-hero .hero { padding: ${topSpacer ? '112px 0 56px' : '56px 0'}; }
        }
        @media (max-width: 520px) {
          lc-hero .row { grid-template-columns: 1fr; gap: 0; }
          lc-hero .card { padding: 22px; }
        }
      </style>
      <section class="hero" id="top">
        <div class="inner">
          <div class="pitch">
            <div class="kicker">${t(kicker)}</div>
            <h1>${t(headline)}</h1>
            <p class="sub">${t(sub)}</p>
            <div class="callline">${t(strings.call)} <a href="${LC.phoneHref}">${LC.phoneDisplay}</a></div>
            <div class="trust">
              ${strings.trust.map((s) => `<span>${t(s)}</span>`).join('')}
            </div>
          </div>
          <div class="card">
            <h2>${t(f.title)}</h2>
            <form novalidate>
              <div class="row">
                <input name="firstName" required autocomplete="given-name" placeholder="${t(f.firstName)}" aria-label="${t(f.firstName)}" />
                <input name="lastName" required autocomplete="family-name" placeholder="${t(f.lastName)}" aria-label="${t(f.lastName)}" />
              </div>
              <div class="row">
                <input name="phone" type="tel" required autocomplete="tel" placeholder="${t(f.phone)}" aria-label="${t(f.phone)}" />
                <input name="email" type="email" autocomplete="email" placeholder="${t(f.email)}" aria-label="${t(f.email)}" />
              </div>
              <div class="row">
                <select name="city" aria-label="${t(f.city)}">
                  <option value="" selected disabled>${t(f.city)}</option>
                  ${floridaCities.map((c) => `<option value="${c}">${c}</option>`).join('')}
                </select>
                <select name="county" aria-label="${t(f.county)}">
                  <option value="" selected disabled>${t(f.county)}</option>
                  ${floridaCounties.map((c) => `<option value="${c}">${c} ${t(f.countySuffix)}</option>`).join('')}
                </select>
              </div>
              <div class="row">
                <select name="caseType" required aria-label="${t(f.caseType)}">
                  <option value="" ${presetCaseType ? '' : 'selected'} disabled>${t(f.caseType)}</option>
                  ${f.caseTypes.map((c) => `<option value="${c.value}" ${c.value === presetCaseType ? 'selected' : ''}>${t(c.label)}</option>`).join('')}
                </select>
                <select name="preferredLanguage" aria-label="${t(f.preferredLanguage)}">
                  <option value="" selected disabled>${t(f.preferredLanguage)}</option>
                  ${f.languages.map((l) => `<option value="${l.value}">${t(l.label)}</option>`).join('')}
                </select>
              </div>
              <textarea name="description" placeholder="${t(f.describe)}" aria-label="${t(f.describe)}"></textarea>
              <div class="legal">
                <p>${t(f.legal1)}</p>
                <p>${t(f.legal2)}</p>
              </div>
              <button type="submit" class="lc-btn lc-btn--cta">${t(f.submit)}</button>
              <div class="msg" role="status"></div>
            </form>
          </div>
        </div>
      </section>
    `;
    this.querySelector('form').addEventListener('submit', (e) => this.submit(e));
  }

  async submit(e) {
    e.preventDefault();
    const f = strings.form;
    const form = e.target;
    const btn = form.querySelector('button[type=submit]');
    const msg = form.querySelector('.msg');
    const data = Object.fromEntries(new FormData(form).entries());

    const payload = {
      name: `${(data.firstName || '').trim()} ${(data.lastName || '').trim()}`.trim(),
      phone: data.phone,
      email: data.email,
      city: data.city,
      county: data.county,
      caseType: data.caseType,
      preferredLanguage: data.preferredLanguage,
      description: data.description,
      language: getLang(),
      consent: true, // consent is granted by submitting; legalese shown above the button
      source: 'case-evaluation-form',
    };

    btn.disabled = true;
    btn.textContent = t(f.sending);
    msg.textContent = '';
    msg.className = 'msg';

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error((body.errors || []).join(', '));
      msg.textContent = t(f.success);
      msg.classList.add('ok');
      form.reset();
    } catch (err) {
      msg.textContent = `${t(f.error)} ${LC.phoneDisplay}. ${err.message || ''}`;
      msg.classList.add('err');
    } finally {
      btn.disabled = false;
      btn.textContent = t(f.submit);
    }
  }
}

customElements.define('lc-hero', LcHero);
