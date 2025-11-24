import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { theme, auth, isLoggedIn, clearAuth, initAuth, profileState } from '$lib/stores';

//
// 프로필 불러오기
//
export async function fetchUserProfile() {
  const token = get(auth)?.access_token;
  if (!token) return;

  try {
    const res = await fetch('/api/profile/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('프로필 불러오기 실패');

    const data = await res.json();
    profileState.set(data);
  } catch (err) {
    console.error(err);
    profileState.set(null);
  }
}

//
// 테마 변경
//
export async function handleThemeChange(event: CustomEvent<{ theme: 'light' | 'dark' }>) {
  const newTheme = event.detail.theme;
  theme.setTheme(newTheme);

  const token = get(auth)?.access_token;
  if (!token) return;

  try {
    await fetch('/api/profile/theme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ theme: newTheme })
    });
  } catch (err) {
    console.error('테마 저장 실패:', err);
  }
}

//
// 로그아웃
//
export async function handleLogout() {
  const token = get(auth)?.access_token;

  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });

    clearAuth();
    profileState.set(null);
    goto('/auth/login');
  } catch (err) {
    console.error('로그아웃 실패:', err);
  }
}

//
// 페이지 초기화
//
export async function initSettingsPage() {
  await initAuth();

  if (!get(isLoggedIn)) {
    return false; // 로그인 안됨
  }

  await fetchUserProfile();

  if (!get(profileState)) {
    clearAuth();
    return false; // 프로필 없음
  }

  return true; // 모든 준비 완료
}
