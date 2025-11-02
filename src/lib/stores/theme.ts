import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme => {
  if (!browser) return 'light'; // SSR에서는 light 기본
  const stored = localStorage.getItem('theme') as Theme;
  if (stored) return stored;
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
};

function createThemeStore() {
  const { subscribe, set } = writable<Theme>(getInitialTheme());

  return {
    subscribe,
    setTheme: (theme: Theme) => {
      if (browser) {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
      }
      set(theme);
    },
    toggle: () => {
      const current: Theme = browser
        ? (document.documentElement.getAttribute('data-theme') as Theme) || 'light'
        : 'light';
      const newTheme: Theme = current === 'light' ? 'dark' : 'light';
      if (browser) {
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      }
      set(newTheme);
    }
  };
}

export const theme = createThemeStore();
