// src/lib/stores/user.ts
import { writable } from 'svelte/store';

export const user = writable<{
  id: string | null;
  nickname: string | null;
  profileImage?: string;  // 프로필 이미지 URL
  bio:string;
  theme: string;
}>({
  id: null,
  nickname: null,
  profileImage: undefined,
  bio:"",
  theme: 'light'
});

export function setTheme(newTheme: string) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', newTheme);
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', newTheme);
  }

  user.update((u) => ({
    ...u,
    theme: newTheme
  }));
}