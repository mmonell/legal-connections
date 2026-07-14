export const LANGS = ['en', 'es', 'pt'];

// Flag + label shown in the language dropdown across the site.
export const LANG_META = {
  en: { flag: '🇺🇸', label: 'English' },
  es: { flag: '🇪🇸', label: 'Español' },
  pt: { flag: '🇧🇷', label: 'Português' },
};

function detectLang() {
  const nav = (navigator.language || 'en').toLowerCase();
  if (nav.startsWith('es')) return 'es';
  if (nav.startsWith('pt')) return 'pt';
  return 'en';
}

const stored = localStorage.getItem('lc-lang');
let current = LANGS.includes(stored) ? stored : detectLang();

export function getLang() {
  return current;
}

export function nextLang(lang = current) {
  return LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length];
}

export function setLang(lang) {
  if (!LANGS.includes(lang)) return;
  current = lang;
  localStorage.setItem('lc-lang', lang);
  document.documentElement.lang = lang;
  document.dispatchEvent(new CustomEvent('lc-lang-change', { detail: { lang } }));
}

// t(strings) picks the current language from an { en, es, pt } triple.
export function t(pair) {
  return pair[current] ?? pair.en;
}

// Components call this to re-render whenever the language changes.
export function onLangChange(component, render) {
  const handler = () => render();
  document.addEventListener('lc-lang-change', handler);
  component.addEventListener('disconnected', () =>
    document.removeEventListener('lc-lang-change', handler)
  );
}

document.documentElement.lang = current;
