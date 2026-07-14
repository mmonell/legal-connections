import { LC } from '../config.js';
import { t, onLangChange } from '../i18n.js';

const strings = {
  disclaimer: {
    en: 'Legal Connections is a legal referral network, not a law firm, and does not provide legal advice. Submitting information does not create an attorney–client relationship. Results are never guaranteed.',
    es: 'Legal Connections es una red de referidos legales, no un bufete de abogados, y no ofrece asesoría legal. Enviar información no crea una relación abogado–cliente. Los resultados nunca están garantizados.',
    pt: 'Legal Connections é uma rede de indicações jurídicas, não um escritório de advocacia, e não presta consultoria jurídica. Enviar informações não cria uma relação advogado–cliente. Os resultados nunca são garantidos.',
  },
  contact: { en: 'Contact', es: 'Contacto', pt: 'Contato' },
  rights: { en: 'All rights reserved.', es: 'Todos los derechos reservados.', pt: 'Todos os direitos reservados.' },
};

class LcFooter extends HTMLElement {
  connectedCallback() {
    this.render();
    onLangChange(this, () => this.render());
  }

  render() {
    const year = new Date().getFullYear();
    this.innerHTML = `
      <style>
        lc-footer .foot { background: var(--lc-black); color: rgba(255,255,255,0.7); padding: 56px 0 40px; }
        lc-footer .inner { max-width: var(--lc-max); margin: 0 auto; padding: 0 20px; }
        lc-footer img.logo { height: auto; width: 150px; margin-bottom: 18px; }
        lc-footer .tagline { color: var(--lc-white); font-weight: 700; margin-bottom: 24px; }
        lc-footer .contact a { color: var(--lc-white); text-decoration: none; font-weight: 600; }
        lc-footer .disclaimer {
          font-size: 0.82rem; line-height: 1.6; max-width: 60em;
          border-top: 1px solid rgba(255,255,255,0.15);
          margin-top: 28px; padding-top: 20px;
        }
        lc-footer .rights { font-size: 0.82rem; margin-top: 14px; }
      </style>
      <footer class="foot">
        <div class="inner">
          <img class="logo" src="/assets/logo/12.png" alt="${LC.brandName}" />
          <div class="tagline">${t(LC.tagline)}</div>
          <div class="contact">
            <strong>${t(strings.contact)}:</strong>
            <a href="${LC.phoneHref}">${LC.phoneDisplay}</a> ·
            <a href="mailto:${LC.email}">${LC.email}</a>
          </div>
          <div class="disclaimer">${t(strings.disclaimer)}</div>
          <div class="rights">© ${year} ${LC.brandName}. ${t(strings.rights)}</div>
        </div>
      </footer>
    `;
  }
}

customElements.define('lc-footer', LcFooter);
