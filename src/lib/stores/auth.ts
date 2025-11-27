// 파일 경로: $lib/stores/auth.ts

import { writable, derived, get } from 'svelte/store';
import { jwtDecode } from 'jwt-decode';

// Access Token 만료가 임박했다고 판단할 임계 시간 (초 단위)
const REFRESH_THRESHOLD_SECONDS = 300; // 5분 (만료 5분 전부터 갱신 시도)

interface JWTPayload {
  exp: number; 
  user_uuid: string;
  nickname: string;
}

interface AuthState {
  access_token: string | null;
  exp: number | null; 
  user_uuid: string | null;
  nickname: string | null;
}

// -----------------------------
// Store & Derived Stores
// -----------------------------
export const auth = writable<AuthState>({
  access_token: null,
  exp: null,
  user_uuid: null,
  nickname: null
});

export const isLoggedIn = derived(auth, ($auth) => {
  if (!$auth.access_token || !$auth.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return now < $auth.exp;
});

/**
 * 토큰 갱신 필요 여부: Access Token이 만료되었거나 임계치 이내로 남았을 경우 (사전 갱신)
 */
export const isRefreshNeeded = derived(auth, ($auth) => {
  // Access Token이 아예 없거나 exp 정보가 없으면 갱신 필요
  if (!$auth.access_token || !$auth.exp) return true; 
  
  const now = Math.floor(Date.now() / 1000);
  // 현재 시간이 만료 시간(exp) - 임계치(300초)보다 크거나 같으면 갱신 시도
  return now >= $auth.exp - REFRESH_THRESHOLD_SECONDS;
});

// -----------------------------
// Actions
// -----------------------------

/**
 * 인증 정보를 클리어하고 Refresh Token 쿠키도 제거하도록 서버에 요청합니다. (로그아웃)
 */
export async function clearAuth(options?: { fetch?: typeof fetch }) {
  auth.set({
    access_token: null, exp: null, user_uuid: null, nickname: null
  });
  
  const myFetch = options?.fetch ?? fetch;
  try {
    // SvelteKit 서버 프록시에 로그아웃 요청 (HttpOnly 쿠키 제거 목적)
    await myFetch('/api/auth/logout', { 
         method: 'POST',
         credentials: 'include' 
    });
  } catch (e) {
    console.error("Refresh Token 제거 요청 중 오류 발생:", e);
  }
}

let refreshing = false;

/**
 * Access Token 갱신을 시도합니다. (요구사항 1, 2, 3 모두 충족)
 */
export async function initAuth(options?: { fetch?: typeof fetch }) {
  const tokenState = get(auth);

  // 1. Access Token이 유효하거나 갱신 임계치 밖에 있다면 종료 (요구사항 1)
  if (tokenState.access_token && !get(isRefreshNeeded) && !refreshing) {
    return;
  }
  
  // 2. 이미 갱신 요청이 진행 중이라면 종료
  if (refreshing) return;
  
  refreshing = true;
  const myFetch = options?.fetch ?? fetch;

  try {
    // SvelteKit 엔드포인트로 새 Access Token 요청 (Refresh Token 쿠키 자동 포함)
    const res = await myFetch('/api/auth/token/access', {
      method: 'POST',
      credentials: 'include' 
    });

    if (!res.ok) {
      // Refresh Token도 만료 또는 무효화된 경우 (요구사항 3)
      await clearAuth(options);
      return;
    }

    const data = await res.json();
    if (!data.access_token || typeof data.access_token !== 'string') {
      console.error("No access token returned from server", data);
      await clearAuth(options);
      return;
    }
    
    // Access Token 갱신 성공 (요구사항 2)
    const decoded = jwtDecode<JWTPayload>(data.access_token);

    auth.set({
      access_token: data.access_token,
      exp: decoded.exp,
      user_uuid: decoded.user_uuid,
      nickname: decoded.nickname
   });
  } catch (e) {
    console.error("Access Token 갱신 중 오류 발생:", e);
    await clearAuth(options);
  } finally {
    refreshing = false;
  }
}