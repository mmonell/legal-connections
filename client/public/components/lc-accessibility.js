import { t, onLangChange } from '../i18n.js';

// ADA / accessibility widget: a floating button that opens a panel of
// user-controlled adjustments (larger text, high contrast, readable font,
// highlight links, reduced motion). Preferences are applied via data-*
// attributes on <html> (styled in global.css) and persisted in localStorage.
//
// This is a native, first-party control set — not a third-party overlay.
// Overlay widgets are widely criticized for not delivering real WCAG
// conformance; genuine accessibility comes from the markup/CSS itself, and
// this panel just gives users direct control over presentation.
const STORAGE_KEY = 'lc-a11y';

const OPTIONS = [
  { key: 'bigText', attr: 'a11y-big-text', label: { en: 'Bigger text', es: 'Texto más grande', pt: 'Texto maior' } },
  { key: 'contrast', attr: 'a11y-contrast', label: { en: 'High contrast', es: 'Alto contraste', pt: 'Alto contraste' } },
  { key: 'readable', attr: 'a11y-readable-font', label: { en: 'Readable font', es: 'Fuente legible', pt: 'Fonte legível' } },
  { key: 'links', attr: 'a11y-highlight-links', label: { en: 'Highlight links', es: 'Resaltar enlaces', pt: 'Destacar links' } },
  { key: 'motion', attr: 'a11y-reduce-motion', label: { en: 'Reduce motion', es: 'Reducir movimiento', pt: 'Reduzir movimento' } },
];

const strings = {
  open: { en: 'Accessibility options', es: 'Opciones de accesibilidad', pt: 'Opções de acessibilidade' },
  title: { en: 'Accessibility', es: 'Accesibilidad', pt: 'Acessibilidade' },
  reset: { en: 'Reset', es: 'Restablecer', pt: 'Redefinir' },
  close: { en: 'Close', es: 'Cerrar', pt: 'Fechar' },
};

function loadPrefs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

// Applies stored prefs to <html> as data-* attributes. Exported side effect:
// runs on import so a returning visitor's settings apply before first paint.
export function applyAccessibilityPrefs() {
  const prefs = loadPrefs();
  for (const opt of OPTIONS) {
    if (prefs[opt.key]) document.documentElement.setAttribute(`data-${opt.attr}`, 'true');
    else document.documentElement.removeAttribute(`data-${opt.attr}`);
  }
}

applyAccessibilityPrefs();

class LcAccessibility extends HTMLElement {
  connectedCallback() {
    this.open = false;
    this.render();
    onLangChange(this, () => this.render());
  }

  toggle(key) {
    const prefs = loadPrefs();
    prefs[key] = !prefs[key];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    applyAccessibilityPrefs();
    this.render();
  }

  reset() {
    localStorage.removeItem(STORAGE_KEY);
    applyAccessibilityPrefs();
    this.render();
  }

  render() {
    const prefs = loadPrefs();
    this.innerHTML = `
      <style>
        lc-accessibility .fab {
          position: fixed; right: 22px; bottom: 22px; z-index: 85;
          width: 52px; height: 52px; border-radius: 50%;
          background: var(--lc-emerald); color: var(--lc-white);
          border: 2px solid rgba(255,255,255,0.85);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; box-shadow: 0 8px 24px rgba(0,0,0,0.28);
        }
        lc-accessibility .fab:hover { background: var(--lc-emerald-mid); }
        lc-accessibility .fab svg { width: 28px; height: 28px; }
        lc-accessibility .panel {
          position: fixed; right: 22px; bottom: 86px; z-index: 86;
          width: 260px; background: var(--lc-white); color: var(--lc-ink);
          border-radius: 14px; box-shadow: 0 16px 44px rgba(0,0,0,0.3);
          padding: 16px; display: ${this.open ? 'block' : 'none'};
        }
        lc-accessibility .panel h2 { font-size: 1.05rem; margin: 0 0 12px; }
        lc-accessibility .opt {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; padding: 9px 0; font-size: 0.92rem; font-weight: 600;
        }
        lc-accessibility .opt button {
          border: 0; border-radius: 999px; width: 46px; height: 26px; cursor: pointer;
          background: #d2d6dd; position: relative; transition: background 0.15s ease;
        }
        lc-accessibility .opt button[aria-pressed="true"] { background: var(--lc-emerald); }
        lc-accessibility .opt button::after {
          content: ''; position: absolute; top: 3px; left: 3px;
          width: 20px; height: 20px; border-radius: 50%; background: #fff;
          transition: transform 0.15s ease;
        }
        lc-accessibility .opt button[aria-pressed="true"]::after { transform: translateX(20px); }
        lc-accessibility .foot { display: flex; justify-content: space-between; margin-top: 12px; }
        lc-accessibility .foot button {
          background: none; border: 0; color: var(--lc-gray); font-family: var(--lc-font);
          font-weight: 700; font-size: 0.85rem; cursor: pointer; text-decoration: underline;
        }
      </style>
      <button class="fab" type="button" aria-label="${t(strings.open)}" aria-expanded="${this.open}">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="3.8" r="2"/><path d="M21 8.5c0 .6-.5 1-1.1 1l-4.9-.6v3.3l2.2 6.9c.2.6-.1 1.2-.7 1.4-.6.2-1.2-.1-1.4-.7L12 14.6 9.9 19.8c-.2.6-.8.9-1.4.7-.6-.2-.9-.8-.7-1.4l2.2-6.9V8.9l-4.9.6C4.5 9.5 4 9.1 4 8.5s.5-1.1 1.1-1.1L12 6.5l6.9.9c.6 0 1.1.5 1.1 1.1z"/></svg>
      </button>
      <div class="panel" role="dialog" aria-label="${t(strings.title)}">
        <h2>${t(strings.title)}</h2>
        ${OPTIONS.map((o) => `
          <div class="opt">
            <span>${t(o.label)}</span>
            <button type="button" data-key="${o.key}" role="switch" aria-pressed="${!!prefs[o.key]}" aria-label="${t(o.label)}"></button>
          </div>
        `).join('')}
        <div class="foot">
          <button type="button" class="reset">${t(strings.reset)}</button>
          <button type="button" class="close">${t(strings.close)}</button>
        </div>
      </div>
    `;
    this.querySelector('.fab').addEventListener('click', () => { this.open = !this.open; this.render(); });
    const close = this.querySelector('.close');
    if (close) close.addEventListener('click', () => { this.open = false; this.render(); });
    const reset = this.querySelector('.reset');
    if (reset) reset.addEventListener('click', () => this.reset());
    this.querySelectorAll('.opt button').forEach((btn) =>
      btn.addEventListener('click', () => this.toggle(btn.dataset.key))
    );
  }
}

customElements.define('lc-accessibility', LcAccessibility);
