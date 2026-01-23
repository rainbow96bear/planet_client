// src/lib/stores/user.ts
import { writable } from 'svelte/store';
import type { User, Theme } from '$lib/types/user';

export const user = writable<User>({
  id: null,
  nickname: null,
  profileImage: undefined,
  bio: '',
  theme: 'light'
});

/**
 * ⚠️ 순수 상태 변경만 담당
 * DOM / localStorage / API ❌
 */
export function setUserTheme(theme: Theme) {
  user.update(u => ({
    ...u,
    theme
  }));
}

export function setUserProfile(partial: Partial<User>) {
  user.update(u => ({
    ...u,
    ...partial
  }));
}

export function resetUser() {
  user.set({
    id: null,
    nickname: null,
    profileImage: undefined,
    bio: '',
    theme: 'light'
  });
}
