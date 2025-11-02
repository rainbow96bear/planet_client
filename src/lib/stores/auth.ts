import { writable } from 'svelte/store';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  access_token: string | null;
  exp: number | null;
  user_uuid: string | null;
  nickname: string | null;
}

export function clearAuth() {
  auth.set({
    access_token: null,
    exp: null,
    user_uuid: null,
    nickname: null
  });
}

export const auth = writable<AuthState>({
  access_token: null,
  exp: null,
  user_uuid: null,
  nickname: null,
});

let refreshing = false;

export async function initAuth(options?: { fetch?: typeof window.fetch }) {
    if (refreshing) return;
    
    let tokenValue: any;
    auth.subscribe(v => tokenValue = v)();
    if (tokenValue.access_token && isAccessTokenValid()) return;

    refreshing = true;

    try {
        const res = await (options?.fetch ?? fetch)('/api/auth/token/access', {
            method: 'POST',
            credentials: 'include'
        });

        if (!res.ok) {
            auth.set({ access_token: null, exp: null, user_uuid: null, nickname: null });
            return;
        }

        const data = await res.json();
        const decoded: any = jwtDecode(data.access_token);
        console.log("decoded : ", decoded)
        auth.set({
            access_token: data.access_token,
            exp: decoded.exp,
            user_uuid: decoded.user_uuid,
            nickname: decoded.nickname
        });
    } catch (err) {
        console.error(err);
        auth.set({ access_token: null, exp: null, user_uuid: null, nickname: null });
    } finally {
        refreshing = false;
    }
}

export function isAccessTokenValid() {
  let value: any;
  auth.subscribe(v => value = v)();

  if (!value?.access_token || typeof value.exp !== 'number') {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  return now < value.exp;
}

