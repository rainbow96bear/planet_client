// src/lib/stores/auth.ts
import { writable, derived } from 'svelte/store';

export const auth = writable<{
  accessToken: string | undefined;
  userId: string | null;
  expiresAt: number | null; // UNIX timestamp
}>({
  accessToken: undefined,
  userId: null,
  expiresAt: null
});

// 로그인 여부 계산
export const isLoggedIn = derived(auth, ($auth) => {
  return !!$auth.accessToken && !!$auth.userId;
});

// ✔ Auth 전체 초기화 (로그아웃용)
export function clearAuth() {
  auth.set({
    accessToken: undefined,
    userId: null,
    expiresAt: null
  });
}

// ✔ accessToken만 수정하고 싶을 때 (optional)
export function updateAccessToken(token: string) {
  auth.update((prev) => ({
    ...prev,
    accessToken: token
  }));
}
