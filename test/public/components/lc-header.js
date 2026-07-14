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
};

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
  }
}

customElements.define('lc-header', LcHeader);
