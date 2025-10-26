import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

// 초기 테마 로드 (localStorage 또는 기본값)
const getInitialTheme = (): Theme => {
  if (!browser) return 'light';
  
  const stored = localStorage.getItem('theme') as Theme;
  if (stored) return stored;
  
  // 시스템 테마 확인
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
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
      const current = browser ? 
        document.documentElement.getAttribute('data-theme') as Theme : 
        'light';
      const newTheme = current === 'light' ? 'dark' : 'light';
      
      if (browser) {
        localStorage.setItem('theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
      }
      set(newTheme);
    }
  };
}

export const theme = createThemeStore();