import { t, onLangChange } from '../i18n.js';

// GDPR / cookie-consent banner. Shows once until the visitor accepts or
// declines; the choice is stored in localStorage. On accept it dispatches
// `lc-consent-granted` so any future analytics/marketing scripts can gate
// their loading on real consent (none are loaded today — this is the opt-in
// gate for when they are). Essential cookies (language preference, admin
// session) are not covered by this banner as they're strictly necessary.
const STORAGE_KEY = 'lc-cookie-consent'; // 'accepted' | 'declined'

const strings = {
  message: {
    en: 'We use cookies to run this site and, with your consent, to understand how it is used and improve it. Essential cookies are always on.',
    es: 'Usamos cookies para operar este sitio y, con tu consentimiento, para entender cómo se usa y mejorarlo. Las cookies esenciales siempre están activas.',
    pt: 'Usamos cookies para operar este site e, com seu consentimento, para entender como ele é usado e melhorá-lo. Os cookies essenciais estão sempre ativos.',
  },
  accept: { en: 'Accept all', es: 'Aceptar todo', pt: 'Aceitar tudo' },
  decline: { en: 'Essential only', es: 'Solo esenciales', pt: 'Somente essenciais' },
  privacy: { en: 'Privacy policy', es: 'Política de privacidad', pt: 'Política de privacidade' },
};

class LcConsent extends HTMLElement {
  connectedCallback() {
    if (localStorage.getItem(STORAGE_KEY)) return; // already chose — stay hidden
    this.render();
    onLangChange(this, () => { if (!localStorage.getItem(STORAGE_KEY)) this.render(); });
  }

  choose(value) {
    localStorage.setItem(STORAGE_KEY, value);
    if (value === 'accepted') {
      document.dispatchEvent(new CustomEvent('lc-consent-granted'));
    }
    this.innerHTML = '';
  }

  render() {
    this.innerHTML = `
      <style>
        lc-consent .bar {
          position: fixed; left: 0; right: 0; bottom: 0; z-index: 90;
          background: var(--lc-emerald-deep); color: var(--lc-white);
          box-shadow: 0 -8px 24px rgba(0,0,0,0.25);
          padding: 16px 20px;
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
          justify-content: center;
        }
        lc-consent p {
          margin: 0; font-size: 0.9rem; line-height: 1.5; max-width: 720px;
          color: rgba(255,255,255,0.9);
        }
        lc-consent a { color: #7fd4bc; }
        lc-consent .actions { display: flex; gap: 10px; flex-wrap: wrap; }
        lc-consent button {
          border: 0; border-radius: 999px; padding: 11px 20px; cursor: pointer;
          font-family: var(--lc-font); font-weight: 700; font-size: 0.9rem;
        }
        lc-consent .accept { background: linear-gradient(180deg, var(--lc-cta), var(--lc-cta-dark)); color: var(--lc-white); }
        lc-consent .accept:hover { background: var(--lc-cta-dark); }
        lc-consent .decline { background: transparent; color: var(--lc-white); border: 1px solid rgba(255,255,255,0.4); }
        lc-consent .decline:hover { border-color: var(--lc-white); background: rgba(255,255,255,0.08); }
        @media (max-width: 640px) { lc-consent .bar { flex-direction: column; text-align: center; } }
      </style>
      <div class="bar" role="dialog" aria-label="Cookie consent" aria-live="polite">
        <p>${t(strings.message)}</p>
        <div class="actions">
          <button type="button" class="decline">${t(strings.decline)}</button>
          <button type="button" class="accept">${t(strings.accept)}</button>
        </div>
      </div>
    `;
    this.querySelector('.accept').addEventListener('click', () => this.choose('accepted'));
    this.querySelector('.decline').addEventListener('click', () => this.choose('declined'));
  }
}

customElements.define('lc-consent', LcConsent);
