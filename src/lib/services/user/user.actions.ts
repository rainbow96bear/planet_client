// src/lib/services/user/user.actions.ts
import { get } from 'svelte/store';
import { goto } from '$app/navigation';

import { user, setUserTheme, setUserProfile, resetUser } from '$lib/stores/user';
import { auth, clearAuth } from '$lib/stores/auth';
import type { Theme } from '$lib/types/user';
import { apiFetch } from '$lib/client/apiFetch';

/* ================================
   🌗 테마 변경
================================ */
export async function handleThemeChange(theme: Theme) {
  // 1. store 업데이트
  setUserTheme(theme);

  // 2. DOM 반영 (SSR 안전)
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // 3. localStorage
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('theme', theme);
  }

  // 4. 서버 저장
  const token = get(auth)?.accessToken;
  if (!token) return;

  try {
    await apiFetch('/api/me/theme', {
      method: 'PATCH',
      body: JSON.stringify({ theme }),
      accessToken: token
    });
  } catch (err) {
    console.error('테마 저장 실패:', err);
  }
}

/* ================================
   👤 프로필 업데이트
================================ */
export async function updateProfile(
  nickname: string,
  bio: string,
  profileImage?: string
): Promise<boolean> {
  const token = get(auth)?.accessToken;
  if (!token) return false;

  try {
    const res = await apiFetch('/api/me/profile', {
      method: 'PATCH',
      body: JSON.stringify({
        nickname,
        bio,
        ...(profileImage && { profileImage })
      }),
      accessToken: token
    });

    const data = await res.json();

    setUserProfile({
      nickname: data.nickname,
      bio: data.bio,
      profileImage: data.profileImage
    });

    return true;
  } catch (err) {
    console.error('프로필 업데이트 실패:', err);
    return false;
  }
}

/* ================================
   🚪 로그아웃
================================ */
export async function handleLogout() {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    });
  } catch (err) {
    console.error('로그아웃 요청 실패:', err);
  }

  clearAuth();
  resetUser();
  goto('/');
}
