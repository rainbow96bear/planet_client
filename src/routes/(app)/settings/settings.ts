import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { theme, auth, isLoggedIn, clearAuth, initAuth, userProfile, fetchUserProfile } from '$lib/stores';

export async function handleThemeChange(event: CustomEvent<{ theme: 'light' | 'dark' }>) {
  const newTheme = event.detail.theme;
  theme.setTheme(newTheme);

  const tokenState = get(auth);
  if (!tokenState?.access_token) return;

  try {
    await fetch('/api/user/theme', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenState.access_token}`,
      },
      body: JSON.stringify({ theme: newTheme }),
    });
  } catch (err) {
    console.error('테마 저장 실패:', err);
  }
}

export async function handleLogout() {
  const tokenState = get(auth);
  try {
    await fetch('/api/user/logout', {
      method: 'POST',
      headers: tokenState ? { Authorization: `Bearer ${tokenState.access_token}` } : {},
      credentials: 'include',
    });

    clearAuth();
    userProfile.set(null);
    goto('/');
  } catch (err) {
    console.error('로그아웃 실패:', err);
  }
}

export async function initSettings() {
  await initAuth();
  if (!get(isLoggedIn)) {
    goto('/login');
    return;
  }
  await fetchUserProfile();
}
