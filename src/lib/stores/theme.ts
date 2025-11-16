import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme => {
  if (!browser) return 'light';

  const stored = localStorage.getItem('theme') as Theme;
  if (stored) return stored;

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

function createThemeStore() {
  const { subscribe, set } = writable<Theme>(getInitialTheme());

  // 브라우저에서 구독 시 DOM 초기값 적용
  if (browser) {
    const initial = getInitialTheme();
    document.documentElement.setAttribute('data-theme', initial);
  }

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
      subscribe(current => {
        const newTheme: Theme = current === 'light' ? 'dark' : 'light';
        if (browser) {
          localStorage.setItem('theme', newTheme);
          document.documentElement.setAttribute('data-theme', newTheme);
        }
        set(newTheme);
      })();
    }
  };
}

export const theme = createThemeStore();
