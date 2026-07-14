import { t, onLangChange } from '../i18n.js';

const strings = {
  kicker: { en: 'Why Legal Connections', es: 'Por Qué Legal Connections', pt: 'Por Que Legal Connections' },
  title: { en: 'Connected by Trust', es: 'Conectados por la Confianza', pt: 'Conectados pela Confiança' },
  pillars: [
    {
      title: { en: 'Trusted network', es: 'Red de confianza', pt: 'Rede de confiança' },
      body: {
        en: 'Every attorney and medical provider in our network is vetted. We only connect you with professionals we trust.',
        es: 'Cada abogado y proveedor médico de nuestra red está verificado. Solo te conectamos con profesionales de confianza.',
        pt: 'Todo advogado e prestador médico da nossa rede é verificado. Só conectamos você a profissionais de confiança.',
      },
    },
    {
      title: { en: 'Clarity at every step', es: 'Claridad en cada paso', pt: 'Clareza em cada etapa' },
      body: {
        en: 'No legal jargon, no runaround. We explain what happens next in plain language, in English or Spanish.',
        es: 'Sin lenguaje complicado ni vueltas. Te explicamos el próximo paso en lenguaje claro, en español o inglés.',
        pt: 'Sem juridiquês, sem enrolação. Explicamos o próximo passo em linguagem simples, em português ou inglês.',
      },
    },
    {
      title: { en: 'No cost to connect', es: 'Conectarte es gratis', pt: 'Conectar-se é grátis' },
      body: {
        en: 'Our referral service is free. You pay nothing to get matched with an attorney or medical care.',
        es: 'Nuestro servicio de referidos es gratuito. No pagas nada por ser conectado con un abogado o atención médica.',
        pt: 'Nosso serviço de indicação é gratuito. Você não paga nada para ser conectado a um advogado ou atendimento médico.',
      },
    },
  ],
};

class LcWhy extends HTMLElement {
  connectedCallback() {
    this.render();
    onLangChange(this, () => this.render());
  }

  render() {
    this.innerHTML = `
      <style>
        lc-why .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        lc-why .pillar { border-top: 3px solid var(--lc-cta); padding-top: 20px; }
        lc-why .pillar h3 { font-size: 1.15rem; }
        lc-why .pillar p { color: rgba(255,255,255,0.75); margin: 0; }
        @media (max-width: 820px) { lc-why .grid { grid-template-columns: 1fr; } }
      </style>
      <section class="lc-section lc-section--dark">
        <div class="lc-container">
          <div class="lc-kicker">${t(strings.kicker)}</div>
          <h2 class="lc-h2">${t(strings.title)}</h2>
          <div class="grid">
            ${strings.pillars
              .map((p) => `<div class="pillar"><h3>${t(p.title)}</h3><p>${t(p.body)}</p></div>`)
              .join('')}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('lc-why', LcWhy);
