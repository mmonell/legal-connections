import { LC } from '../config.js';
import { t, getLang, setLang, LANGS, LANG_META, onLangChange } from '../i18n.js';

const strings = {
  nav: [
    { href: '/services/auto-accidents', label: { en: 'Auto Accidents', es: 'Accidentes de Auto', pt: 'Acidentes de Carro' } },
    { href: '/services/personal-injury', label: { en: 'Personal Injury', es: 'Daños Personales', pt: 'Lesões Pessoais' } },
    { href: '/services/workers-comp', label: { en: "Workers' Comp", es: 'Compensación Laboral', pt: 'Indenização Trabalhista' } },
    { href: '/services/immigration', label: { en: 'Immigration', es: 'Inmigración', pt: 'Imigração' } },
  ],
  call: { en: 'Call Now', es: 'Llama Ya', pt: 'Ligue Já' },
  whatsapp: { en: 'WhatsApp', es: 'WhatsApp', pt: 'WhatsApp' },
  whatsappMessage: {
    en: 'Hi, I was in an accident and I would like a free case evaluation.',
    es: 'Hola, tuve un accidente y me gustaría una evaluación gratuita de mi caso.',
    pt: 'Olá, sofri um acidente e gostaria de uma avaliação gratuita do meu caso.',
  },
};

const WHATSAPP_ICON = `
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>`;

class LcHeader extends HTMLElement {
  connectedCallback() {
    this.render();
    onLangChange(this, () => this.render());
  }

  render() {
    const lang = getLang();
    const noNav = this.hasAttribute('no-nav'); // landing pages: header without service nav links
    this.innerHTML = `
      <style>
        lc-header .bar {
          position: ${noNav ? 'absolute' : 'sticky'}; top: 0; left: 0; right: 0; z-index: 50;
          background: ${noNav ? 'transparent' : 'var(--lc-black)'}; color: var(--lc-white);
        }
        lc-header .inner {
          display: flex; align-items: center; gap: 24px;
          padding: 12px 20px; max-width: var(--lc-max); margin: 0 auto;
        }
        lc-header img.logo { height: 44px; width: auto; }
        lc-header nav { display: flex; gap: 20px; }
        lc-header nav a {
          color: rgba(255,255,255,0.85); text-decoration: none; font-weight: 600; font-size: 0.95rem;
        }
        lc-header nav a:hover { color: var(--lc-white); }
        lc-header .right { display: flex; align-items: center; gap: 12px; margin-left: auto; }
        lc-header .lang-wrap { position: relative; }
        lc-header .lang {
          display: flex; align-items: center; gap: 6px;
          background: transparent; color: var(--lc-white);
          border: 1px solid rgba(255,255,255,0.4); border-radius: 999px;
          padding: 6px 14px; font-weight: 700; cursor: pointer; font-family: var(--lc-font);
        }
        lc-header .lang-menu {
          position: absolute; top: calc(100% + 8px); right: 0; z-index: 60;
          background: var(--lc-black); border: 1px solid rgba(255,255,255,0.15);
          border-radius: 12px; padding: 6px; min-width: 150px;
          box-shadow: 0 12px 28px rgba(0,0,0,0.35);
          display: none; flex-direction: column;
        }
        lc-header .lang-menu.open { display: flex; }
        lc-header .lang-menu button {
          display: flex; align-items: center; gap: 10px;
          background: transparent; color: var(--lc-white); border: none;
          border-radius: 8px; padding: 8px 10px; font-family: var(--lc-font);
          font-weight: 600; font-size: 0.9rem; text-align: left; cursor: pointer;
        }
        lc-header .lang-menu button:hover,
        lc-header .lang-menu button[aria-current="true"] { background: rgba(255,255,255,0.1); }
        lc-header .call {
          background: var(--lc-cta); color: var(--lc-white);
          border-radius: 999px; padding: 10px 20px; font-weight: 800;
          text-decoration: none; white-space: nowrap;
        }
        lc-header .wa {
          display: inline-flex; align-items: center; gap: 7px;
          background: var(--lc-whatsapp); color: var(--lc-white);
          border-radius: 999px; padding: 10px 18px; font-weight: 800;
          text-decoration: none; white-space: nowrap;
        }
        lc-header .wa:hover { filter: brightness(0.94); }
        lc-header .wa svg { display: block; }
        @media (max-width: 860px) {
          lc-header nav { display: none; }
          lc-header .inner { gap: 12px; }
        }
        @media (max-width: 480px) {
          lc-header .inner { padding: 10px 14px; gap: 8px; }
          lc-header img.logo { height: 34px; }
          lc-header .lang { padding: 6px 10px; font-size: 0.82rem; }
          lc-header .call { padding: 9px 14px; font-size: 0.85rem; }
          lc-header .call .num { display: none; } /* keep "Call Now", drop the number on tiny screens */
          lc-header .wa .label { display: none; } /* icon-only on tiny screens */
          lc-header .wa { padding: 9px 12px; }
        }
      </style>
      <div class="bar">
        <div class="inner">
          ${noNav ? '' : `
          <a href="/" aria-label="${LC.brandName}">
            <img class="logo" src="/assets/logo/13.png" alt="${LC.brandName}" />
          </a>
          <nav>
            ${strings.nav
              .map((n) => {
                const current = location.pathname === n.href;
                return `<a href="${n.href}"${current ? ' aria-current="page" style="color:var(--lc-cta)"' : ''}>${t(n.label)}</a>`;
              })
              .join('')}
          </nav>
          `}
          <div class="right">
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
            <a class="wa" href="https://wa.me/${LC.whatsappNumber}?text=${encodeURIComponent(t(strings.whatsappMessage))}" target="_blank" rel="noopener" aria-label="WhatsApp">
              ${WHATSAPP_ICON}<span class="label">${t(strings.whatsapp)}</span>
            </a>
            <a class="call" href="${LC.phoneHref}">${t(strings.call)} <span class="num">${LC.phoneDisplay}</span></a>
          </div>
        </div>
      </div>
    `;
    const menu = this.querySelector('.lang-menu');
    this.querySelector('.lang').addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('open');
    });
    menu.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => setLang(btn.dataset.lang));
    });
    document.addEventListener('click', () => menu.classList.remove('open'));
    // Best-effort: record that someone jumped into WhatsApp (no PII), matching
    // the old floating lc-chat button's behavior.
    this.querySelector('.wa').addEventListener('click', () => {
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'whatsapp-chat', name: '[whatsapp visitor]', language: getLang(), consent: true }),
      }).catch(() => {});
    });
  }
}

customElements.define('lc-header', LcHeader);
