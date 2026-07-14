import { LC } from '../config.js';
import { t, onLangChange } from '../i18n.js';

const strings = {
  kicker: { en: 'Our Services', es: 'Nuestros Servicios', pt: 'Nossos Serviços' },
  title: { en: 'Auto accidents are our specialty', es: 'Los accidentes de auto son nuestra especialidad', pt: 'Acidentes de carro são nossa especialidade' },
  featured: {
    title: { en: 'Not sure where to start? Just call.', es: '¿No sabes por dónde empezar? Solo llama.', pt: 'Não sabe por onde começar? É só ligar.' },
    body: {
      en: 'One call and a real person will listen to what happened, in English or Spanish, and point you in the right direction at no cost to you.',
      es: 'Una llamada y una persona real escuchará lo que pasó, en español o inglés, y te orientará en la dirección correcta sin costo alguno.',
      pt: 'Uma ligação e uma pessoa de verdade vai ouvir o que aconteceu, em português ou inglês, e te orientar na direção certa sem nenhum custo.',
    },
    cta: { en: 'Call Now', es: 'Llama Ya', pt: 'Ligue Já' },
  },
  others: [
    { href: '/services/auto-accidents', label: { en: 'Auto Accidents', es: 'Accidentes de Auto', pt: 'Acidentes de Carro' } },
    { href: '/services/personal-injury', label: { en: 'Personal Injury', es: 'Daños Personales', pt: 'Lesões Pessoais' } },
    { href: '/services/workers-comp', label: { en: 'Workers’ Compensation', es: 'Compensación Laboral', pt: 'Indenização Trabalhista' } },
    { href: '/services/immigration', label: { en: 'Immigration', es: 'Inmigración', pt: 'Imigração' } },
  ],
  othersTitle: { en: 'All our services', es: 'Todos nuestros servicios', pt: 'Todos os nossos serviços' },
};

class LcServices extends HTMLElement {
  connectedCallback() {
    this.render();
    onLangChange(this, () => this.render());
  }

  render() {
    this.innerHTML = `
      <style>
        lc-services .layout { display: grid; grid-template-columns: 1.4fr 1fr; gap: 40px; align-items: stretch; }
        lc-services .featured {
          background: var(--lc-black); color: var(--lc-white);
          border-radius: var(--lc-radius); padding: 36px;
          display: flex; flex-direction: column; align-items: flex-start;
        }
        lc-services .featured h3 { font-size: 1.6rem; }
        lc-services .featured p { color: rgba(255,255,255,0.8); margin-bottom: 24px; }
        lc-services .featured .phone {
          color: var(--lc-cta); font-weight: 800; font-size: 1.3rem;
          text-decoration: none; margin-bottom: 24px; display: inline-block;
        }
        lc-services .featured a.lc-btn { margin-top: auto; }
        lc-services .others h3 { font-size: 1.1rem; color: var(--lc-gray); font-weight: 700; }
        lc-services .others ul { list-style: none; margin: 0; padding: 0; }
        lc-services .others li { border-bottom: 1px solid #e3e5e9; }
        lc-services .others a {
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px 0; font-weight: 700; font-size: 1.05rem;
          color: var(--lc-ink); text-decoration: none;
        }
        lc-services .others a::after { content: '→'; color: var(--lc-cta); font-weight: 800; }
        lc-services .others a:hover { color: var(--lc-cta); }
        @media (max-width: 820px) { lc-services .layout { grid-template-columns: 1fr; } }
      </style>
      <section class="lc-section" id="services">
        <div class="lc-container">
          <div class="lc-kicker">${t(strings.kicker)}</div>
          <h2 class="lc-h2">${t(strings.title)}</h2>
          <div class="layout">
            <div class="featured">
              <h3>${t(strings.featured.title)}</h3>
              <p>${t(strings.featured.body)}</p>
              <a class="phone" href="${LC.phoneHref}">${LC.phoneDisplay}</a>
              <a class="lc-btn lc-btn--cta" href="${LC.phoneHref}">${t(strings.featured.cta)}</a>
            </div>
            <div class="others">
              <h3>${t(strings.othersTitle)}</h3>
              <ul>
                ${strings.others
                  .map((o) => `<li><a href="${o.href}">${t(o.label)}</a></li>`)
                  .join('')}
              </ul>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('lc-services', LcServices);
