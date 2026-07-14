import { LC } from '../config.js';
import { t, getLang, onLangChange } from '../i18n.js';

const strings = {
  bubbleLabel: { en: 'WhatsApp', es: 'WhatsApp', pt: 'WhatsApp' },
  message: {
    en: 'Hi, I was in an accident and I would like a free case evaluation.',
    es: 'Hola, tuve un accidente y me gustaría una evaluación gratuita de mi caso.',
    pt: 'Olá, sofri um acidente e gostaria de uma avaliação gratuita do meu caso.',
  },
};

const WHATSAPP_ICON = `
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>`;

// One-tap WhatsApp button: opens the real WhatsApp chat (app or web),
// prefilled. Renders inline (centered, in the page flow) by default; pages
// like the landing template can set position="bottom" for the classic fixed
// bottom-right corner spot.
class LcChat extends HTMLElement {
  connectedCallback() {
    this.render();
    onLangChange(this, () => this.render());
  }

  waLink() {
    return `https://wa.me/${LC.whatsappNumber}?text=${encodeURIComponent(t(strings.message))}`;
  }

  render() {
    const bottom = this.getAttribute('position') === 'bottom';
    this.innerHTML = `
      <style>
        lc-chat { display: block; text-align: center; }
        lc-chat .bubble {
          ${bottom ? 'position: fixed; right: 22px; bottom: 22px; z-index: 90;' : 'position: static;'}
          display: inline-flex; align-items: center; gap: 9px;
          background: var(--lc-whatsapp); color: var(--lc-white);
          border: 0; border-radius: 999px;
          padding: 11px 20px; font-family: var(--lc-font); font-weight: 800; font-size: 0.98rem;
          cursor: pointer; box-shadow: 0 6px 20px rgba(37, 211, 102, 0.35);
          text-decoration: none;
        }
        lc-chat .bubble:hover { filter: brightness(0.94); }
        lc-chat .bubble svg { display: block; }
      </style>
      <a class="bubble" href="${this.waLink()}" target="_blank" rel="noopener">
        ${WHATSAPP_ICON}
        ${t(strings.bubbleLabel)}
      </a>
    `;
    // Best-effort: record that someone jumped into WhatsApp (no PII).
    this.querySelector('.bubble').addEventListener('click', () => {
      fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'whatsapp-chat',
          name: '[whatsapp visitor]',
          language: getLang(),
          consent: true,
        }),
      }).catch(() => {});
    });
  }
}

customElements.define('lc-chat', LcChat);
