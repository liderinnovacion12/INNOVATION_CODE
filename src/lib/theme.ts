export type Theme = 'dark' | 'light';

export const THEME_KEY = 'ics:theme-v2';
const THEME_COLOR: Record<Theme, string> = { dark: '#040A18', light: '#F3F7FC' };

/** El tema inicial lo fija un script en index.html antes del primer pintado (sin parpadeo). */
export const getTheme = (): Theme =>
  document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

export function setTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.add('theme-switching');
  root.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* sin almacenamiento: el tema se aplica solo a esta visita */
  }
  window.setTimeout(() => root.classList.remove('theme-switching'), 500);
}
