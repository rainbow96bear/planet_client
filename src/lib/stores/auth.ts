import { writable, get } from 'svelte/store';

interface AuthState {
  access_token: string | null;
  access_token_exp: number | null; // UNIX timestamp
}

export const auth = writable<AuthState>({
  access_token: null,
  access_token_exp: null
});

// access token 유효성 체크
export function isAccessTokenValid(): boolean {
  const state = get(auth);
  console.log("test : state", state)
  if (state.access_token_exp != null) {
    console.log("test : state", state?.access_token_exp > Date.now() / 1000)
  }
  console.log("test : state", Date.now() / 1000)
  if (state.access_token && state.access_token_exp) {
    const now = Date.now() / 1000; // 초 단위
    return state.access_token_exp > now;
  }
  return false;
}
