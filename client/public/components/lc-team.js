import { LC } from '../config.js';
import { t, onLangChange } from '../i18n.js';

const strings = {
  kicker: { en: 'Connect With Us', es: 'Conéctate Con Nosotros', pt: 'Conecte-se Conosco' },
  title: {
    en: 'Follow us for updates, tips, and real stories',
    es: 'Síguenos para novedades, consejos e historias reales',
    pt: 'Siga-nos para novidades, dicas e histórias reais',
  },
  links: [
    { key: 'facebook', label: { en: 'Facebook', es: 'Facebook', pt: 'Facebook' } },
    { key: 'instagram', label: { en: 'Instagram', es: 'Instagram', pt: 'Instagram' } },
    { key: 'tiktok', label: { en: 'TikTok', es: 'TikTok', pt: 'TikTok' } },
    { key: 'youtube', label: { en: 'YouTube', es: 'YouTube', pt: 'YouTube' } },
  ],
};

// Simple inline brand marks so this section has no external icon-font/CDN
// dependency (matches this project's no-build, no-npm-frontend rule).
const ICONS = {
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8.5h2.85l.43-3.32h-3.28V8.05c0-.96.27-1.62 1.65-1.62h1.76V3.47C16.6 3.4 15.55 3.3 14.32 3.3c-2.56 0-4.32 1.56-4.32 4.43v2.45H7.14v3.32h2.86V22h3.5z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2c-2.72 0-3.06.01-4.12.06-1.06.05-1.79.22-2.43.47-.66.26-1.22.6-1.77 1.16-.56.55-.9 1.11-1.16 1.77-.25.64-.42 1.37-.47 2.43C2 8.94 2 9.28 2 12s.01 3.06.06 4.12c.05 1.06.22 1.79.47 2.43.26.66.6 1.22 1.16 1.77.55.56 1.11.9 1.77 1.16.64.25 1.37.42 2.43.47C8.94 22 9.28 22 12 22s3.06-.01 4.12-.06c1.06-.05 1.79-.22 2.43-.47.66-.26 1.22-.6 1.77-1.16.56-.55.9-1.11 1.16-1.77.25-.64.42-1.37.47-2.43.05-1.06.06-1.4.06-4.12s-.01-3.06-.06-4.12c-.05-1.06-.22-1.79-.47-2.43a4.9 4.9 0 0 0-1.16-1.77 4.9 4.9 0 0 0-1.77-1.16c-.64-.25-1.37-.42-2.43-.47C15.06 2.01 14.72 2 12 2zm0 1.8c2.67 0 2.99.01 4.04.06.98.04 1.5.21 1.86.35.47.18.8.4 1.15.75.35.35.57.68.75 1.15.14.36.31.88.35 1.86.05 1.05.06 1.37.06 4.04s-.01 2.99-.06 4.04c-.04.98-.21 1.5-.35 1.86-.18.47-.4.8-.75 1.15-.35.35-.68.57-1.15.75-.36.14-.88.31-1.86.35-1.05.05-1.37.06-4.04.06s-2.99-.01-4.04-.06c-.98-.04-1.5-.21-1.86-.35a3.1 3.1 0 0 1-1.15-.75 3.1 3.1 0 0 1-.75-1.15c-.14-.36-.31-.88-.35-1.86C3.8 14.99 3.8 14.67 3.8 12s0-2.99.06-4.04c.04-.98.21-1.5.35-1.86.18-.47.4-.8.75-1.15.35-.35.68-.57 1.15-.75.36-.14.88-.31 1.86-.35C8.99 3.8 9.33 3.8 12 3.8zm0 3.05a5.15 5.15 0 1 0 0 10.3 5.15 5.15 0 0 0 0-10.3zm0 8.5a3.35 3.35 0 1 1 0-6.7 3.35 3.35 0 0 1 0 6.7zm5.35-8.7a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.8 2h-3.4v13.6a2.8 2.8 0 1 1-2-2.68V9.4a6.2 6.2 0 1 0 5.4 6.15c0-.1 0-.2-.01-.3V9.02a8.1 8.1 0 0 0 4.6 1.43V7.06a4.75 4.75 0 0 1-4.6-5.06z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.51 3.5 12 3.5 12 3.5s-7.51 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.87.55 9.38.55 9.38.55s7.51 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.6 15.6V8.4l6.24 3.6-6.24 3.6z"/></svg>',
};

class LcTeam extends HTMLElement {
  connectedCallback() {
    this.render();
    onLangChange(this, () => this.render());
  }

  render() {
    this.innerHTML = `
      <style>
        lc-team .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        lc-team .card {
          text-align: center; text-decoration: none; color: inherit;
          display: block; padding: 12px; border-radius: var(--lc-radius);
          transition: transform 0.15s ease, background 0.15s ease;
        }
        lc-team .card:hover { transform: translateY(-3px); background: rgba(46, 107, 90, 0.08); }
        lc-team .icon {
          width: 96px; height: 96px; border-radius: 50%;
          background: var(--lc-black); color: var(--lc-white);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 14px;
        }
        lc-team .icon svg { width: 40px; height: 40px; }
        lc-team h3 { font-size: 1.05rem; margin: 0; }
        @media (max-width: 820px) { lc-team .grid { grid-template-columns: repeat(2, 1fr); } }
      </style>
      <section class="lc-section lc-section--light" id="connect">
        <div class="lc-container">
          <div class="lc-kicker">${t(strings.kicker)}</div>
          <h2 class="lc-h2">${t(strings.title)}</h2>
          <div class="grid">
            ${strings.links
              .map(
                (l) => `
              <a class="card" href="${LC.social[l.key]}" target="_blank" rel="noopener">
                <div class="icon" aria-hidden="true">${ICONS[l.key]}</div>
                <h3>${t(l.label)}</h3>
              </a>`
              )
              .join('')}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('lc-team', LcTeam);
