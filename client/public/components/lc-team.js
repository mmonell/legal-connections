import { t, onLangChange } from '../i18n.js';

const strings = {
  kicker: { en: 'Our Team', es: 'Nuestro Equipo', pt: 'Nossa Equipe' },
  title: { en: 'The people behind every connection', es: 'Las personas detrás de cada conexión', pt: 'As pessoas por trás de cada conexão' },
  members: [
    { name: 'Eric Nieves', role: { en: 'Founder', es: 'Fundador', pt: 'Fundador' } },
    { name: 'Allam Quintero', role: { en: 'Marketing Strategy Director', es: 'Director de Estrategia de Marketing', pt: 'Diretor de Estratégia de Marketing' } },
    { name: 'Jorge Lugo', role: { en: 'Creative & Brand Director', es: 'Director Creativo y de Marca', pt: 'Diretor Criativo e de Marca' } },
    { name: 'Alondra Modesto', role: { en: 'Marketer & Face of the Brand', es: 'Marketer y Cara de la Marca', pt: 'Marketing e Rosto da Marca' } },
  ],
};

function initials(name) {
  return name.split(' ').map((w) => w[0]).join('');
}

class LcTeam extends HTMLElement {
  connectedCallback() {
    this.render();
    onLangChange(this, () => this.render());
  }

  render() {
    this.innerHTML = `
      <style>
        lc-team .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        lc-team .card { text-align: center; }
        lc-team .avatar {
          width: 96px; height: 96px; border-radius: 50%;
          background: var(--lc-black); color: var(--lc-white);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.6rem; font-weight: 800; margin: 0 auto 14px;
        }
        lc-team h3 { font-size: 1.05rem; margin-bottom: 2px; }
        lc-team p { color: var(--lc-gray); font-size: 0.92rem; margin: 0; }
        @media (max-width: 820px) { lc-team .grid { grid-template-columns: repeat(2, 1fr); } }
      </style>
      <section class="lc-section lc-section--light" id="team">
        <div class="lc-container">
          <div class="lc-kicker">${t(strings.kicker)}</div>
          <h2 class="lc-h2">${t(strings.title)}</h2>
          <div class="grid">
            ${strings.members
              .map(
                (m) => `
              <div class="card">
                <div class="avatar" aria-hidden="true">${initials(m.name)}</div>
                <h3>${m.name}</h3>
                <p>${t(m.role)}</p>
              </div>`
              )
              .join('')}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('lc-team', LcTeam);
