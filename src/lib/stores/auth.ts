import { writable, derived, get } from 'svelte/store';
import { jwtDecode } from 'jwt-decode';


interface AuthState {
  access_token: string | null;
  exp: number | null;
  user_uuid: string | null;
  nickname: string | null;
}

export const auth = writable<AuthState>({
  access_token: null,
  exp: null,
  user_uuid: null,
  nickname: null
});

// 로그인 상태
export const isLoggedIn = derived(auth, ($auth) => {
  if (!$auth.access_token || !$auth.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return now < $auth.exp;
});

// 토큰 만료 여부
export const isTokenExpired = derived(auth, ($auth) => {
  if (!$auth.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return now >= $auth.exp;
});

// -----------------------------
// Actions
// -----------------------------
export function clearAuth() {
  auth.set({
    access_token: null,
    exp: null,
    user_uuid: null,
    nickname: null
  });
}

let refreshing = false;

export async function initAuth(options?: { fetch?: typeof fetch }) {
  if (refreshing) return;

  const current = get(auth);

  if (current.access_token && !get(isTokenExpired)) return;

  refreshing = true;
  const myFetch = options?.fetch ?? fetch;

  try {
    const res = await myFetch('/api/auth/token/access', {
      method: 'POST',
      credentials: 'include'
    });

    if (!res.ok) {
      clearAuth();
      return;
    }

    const data = await res.json();
    if (!data.access_token || typeof data.access_token !== 'string') {
      console.error("No access token returned from server", data);
      clearAuth();
      return;
    }
    const decoded: any = jwtDecode(data.access_token);

    auth.set({
      access_token: data.access_token,
      exp: decoded.exp,
      user_uuid: decoded.user_uuid,
      nickname: decoded.nickname
    });
  } catch (e) {
    console.error(e);
    clearAuth();
  } finally {
    refreshing = false;
  }
}
