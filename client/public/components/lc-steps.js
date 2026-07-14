import { t, onLangChange } from '../i18n.js';

const strings = {
  kicker: { en: 'How It Works', es: 'Cómo Funciona', pt: 'Como Funciona' },
  title: { en: 'Three simple steps to move forward', es: 'Tres pasos simples para seguir adelante', pt: 'Três passos simples para seguir em frente' },
  steps: [
    {
      title: { en: 'Tell us what happened', es: 'Cuéntanos qué pasó', pt: 'Conte-nos o que aconteceu' },
      body: {
        en: 'Fill out the free case evaluation or message us on WhatsApp. It takes two minutes.',
        es: 'Completa la evaluación gratuita o escríbenos por WhatsApp. Toma dos minutos.',
        pt: 'Preencha a avaliação gratuita do seu caso ou nos envie uma mensagem pelo WhatsApp. Leva dois minutos.',
      },
    },
    {
      title: { en: 'We connect you', es: 'Te conectamos', pt: 'Nós te conectamos' },
      body: {
        en: 'We match you with a trusted attorney and, if you need it, medical care from our network.',
        es: 'Te conectamos con un abogado de confianza y, si lo necesitas, atención médica de nuestra red.',
        pt: 'Conectamos você a um advogado de confiança e, se precisar, a atendimento médico da nossa rede.',
      },
    },
    {
      title: { en: 'You move forward', es: 'Sigues adelante', pt: 'Você segue em frente' },
      body: {
        en: 'Your attorney takes it from there while you focus on your recovery.',
        es: 'Tu abogado se encarga del caso mientras tú te enfocas en tu recuperación.',
        pt: 'Seu advogado cuida do caso enquanto você se concentra na sua recuperação.',
      },
    },
  ],
};

class LcSteps extends HTMLElement {
  connectedCallback() {
    this.render();
    onLangChange(this, () => this.render());
  }

  render() {
    this.innerHTML = `
      <style>
        lc-steps .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        lc-steps .card {
          background: var(--lc-white); border-radius: var(--lc-radius);
          padding: 28px; box-shadow: var(--lc-shadow);
        }
        lc-steps .num {
          display: inline-flex; align-items: center; justify-content: center;
          width: 44px; height: 44px; border-radius: 50%;
          background: var(--lc-black); color: var(--lc-cta);
          font-weight: 800; font-size: 1.2rem; margin-bottom: 16px;
        }
        lc-steps h3 { font-size: 1.2rem; }
        lc-steps p { color: var(--lc-gray); margin: 0; }
        @media (max-width: 820px) { lc-steps .grid { grid-template-columns: 1fr; } }
      </style>
      <section class="lc-section lc-section--light" id="how-it-works">
        <div class="lc-container">
          <div class="lc-kicker">${t(strings.kicker)}</div>
          <h2 class="lc-h2">${t(strings.title)}</h2>
          <div class="grid">
            ${strings.steps
              .map(
                (s, i) => `
              <div class="card">
                <span class="num">${i + 1}</span>
                <h3>${t(s.title)}</h3>
                <p>${t(s.body)}</p>
              </div>`
              )
              .join('')}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('lc-steps', LcSteps);
