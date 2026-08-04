import { LC } from '../config.js';
import { t, onLangChange } from '../i18n.js';
import { LEGAL_DOCS, LEGAL_META } from './legalDocs.js';

// Renders one long-form legal document (privacy policy or terms of use) from
// the structured content in legalDocs.js. Which document is rendered comes
// from the `doc` attribute: <lc-legal-page doc="privacy">.
//
// Content is data, not markup, so all three languages stay in lockstep and the
// page re-renders in place on `lc-lang-change` like every other component.
// A section is { heading: {en,es,pt}, body: [ ...blocks ] } where each block is
// either a {en,es,pt} paragraph triple or { list: [ {en,es,pt}, ... ] }.
class LcLegalPage extends HTMLElement {
  connectedCallback() {
    this.render();
    onLangChange(this, () => this.render());
  }

  renderBlock(block) {
    if (block.list) {
      return `<ul>${block.list.map((item) => `<li>${t(item)}</li>`).join('')}</ul>`;
    }
    return `<p>${t(block)}</p>`;
  }

  render() {
    const key = this.getAttribute('doc') === 'terms' ? 'terms' : 'privacy';
    const doc = LEGAL_DOCS[key];
    const meta = LEGAL_META;

    // Keep the document <h1> and the browser tab in sync with the language.
    document.title = `${t(doc.title)} | ${LC.brandName}`;

    const toc = doc.sections
      .map((s, i) => `<li><a href="#s${i + 1}">${t(s.heading)}</a></li>`)
      .join('');

    const sections = doc.sections
      .map(
        (s, i) => `
        <section id="s${i + 1}">
          <h2>${i + 1}. ${t(s.heading)}</h2>
          ${s.body.map((b) => this.renderBlock(b)).join('')}
        </section>`
      )
      .join('');

    this.innerHTML = `
      <style>
        lc-legal-page .wrap { max-width: 820px; margin: 0 auto; padding: 56px 20px 80px; }
        lc-legal-page .kicker {
          text-transform: uppercase; letter-spacing: 0.14em; font-size: 0.8rem;
          font-weight: 700; color: var(--lc-gray); margin-bottom: 10px;
        }
        lc-legal-page h1 { font-size: clamp(1.9rem, 4vw, 2.6rem); font-weight: 800; }
        lc-legal-page .dates {
          color: var(--lc-gray); font-size: 0.9rem; margin: 0 0 28px;
        }
        lc-legal-page .intro {
          background: var(--lc-light); border-left: 4px solid var(--lc-cta);
          border-radius: 0 var(--lc-radius) var(--lc-radius) 0;
          padding: 18px 20px; margin-bottom: 34px;
        }
        lc-legal-page .intro p { margin: 0 0 10px; }
        lc-legal-page .intro p:last-child { margin-bottom: 0; }
        lc-legal-page .toc {
          border: 1px solid #e3e5ea; border-radius: var(--lc-radius);
          padding: 18px 22px; margin-bottom: 40px;
        }
        lc-legal-page .toc strong { display: block; margin-bottom: 10px; }
        lc-legal-page .toc ol {
          margin: 0; padding-left: 20px;
          columns: 2; column-gap: 28px;
        }
        lc-legal-page .toc li { margin-bottom: 6px; break-inside: avoid; }
        lc-legal-page .toc a { color: var(--lc-emerald); text-decoration: none; font-size: 0.93rem; }
        lc-legal-page .toc a:hover { text-decoration: underline; }
        lc-legal-page section { margin-bottom: 34px; scroll-margin-top: 90px; }
        lc-legal-page h2 {
          font-size: 1.25rem; font-weight: 800; color: var(--lc-emerald-deep);
          margin: 0 0 12px;
        }
        lc-legal-page p { margin: 0 0 14px; }
        lc-legal-page ul { margin: 0 0 14px; padding-left: 22px; }
        lc-legal-page li { margin-bottom: 8px; }
        lc-legal-page a { color: var(--lc-emerald); }
        lc-legal-page .contact-box {
          background: var(--lc-emerald-deep); color: var(--lc-white);
          border-radius: var(--lc-radius); padding: 24px 26px; margin-top: 40px;
        }
        lc-legal-page .contact-box h2 { color: var(--lc-white); }
        lc-legal-page .contact-box a { color: #7fd4bc; }
        lc-legal-page .other-doc { margin-top: 28px; font-size: 0.95rem; }
        @media (max-width: 640px) { lc-legal-page .toc ol { columns: 1; } }
      </style>
      <article class="wrap">
        <div class="kicker">${t(meta.kicker)}</div>
        <h1>${t(doc.title)}</h1>
        <p class="dates">
          ${t(meta.effective)}: ${t(meta.effectiveDate)} &nbsp;·&nbsp;
          ${t(meta.updated)}: ${t(meta.updatedDate)}
        </p>
        <div class="intro">${doc.intro.map((b) => this.renderBlock(b)).join('')}</div>
        <nav class="toc" aria-label="${t(meta.contents)}">
          <strong>${t(meta.contents)}</strong>
          <ol>${toc}</ol>
        </nav>
        ${sections}
        <div class="contact-box">
          <h2>${t(meta.contactHeading)}</h2>
          <p>${t(meta.contactBody)}</p>
          <p>
            <a href="mailto:${LC.email}">${LC.email}</a><br />
            <a href="${LC.phoneHref}">${LC.phoneDisplay}</a>
          </p>
        </div>
        <p class="other-doc">
          <a href="${key === 'privacy' ? '/terms' : '/privacy'}">
            ${key === 'privacy' ? t(LEGAL_DOCS.terms.title) : t(LEGAL_DOCS.privacy.title)} →
          </a>
        </p>
      </article>
    `;
  }
}

customElements.define('lc-legal-page', LcLegalPage);
