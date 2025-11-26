// $lib/stores/auth.ts

import { writable, derived, get } from 'svelte/store';
import { jwtDecode } from 'jwt-decode';

/**
 * @interface AuthState
 * Refresh Token을 저장하는 필드를 추가했습니다.
 * 실제로는 Refresh Token은 보안상 쿠키(HttpOnly)에만 저장하고 Store에는
 * Access Token 관련 정보만 두는 것이 일반적입니다.
 * 하지만 현재 SvelteKit 엔드포인트에서 쿠키를 사용하는 구조이므로,
 * Store에는 Access Token 정보만 남기고 Refresh Token 사용은 서버에 위임합니다.
 * Refresh Token을 Store에 명시적으로 저장할 필요는 없습니다.
 */
interface AuthState {
  access_token: string | null;
  exp: number | null; // Access Token 만료 시간 (Unix Timestamp)
  user_uuid: string | null;
  nickname: string | null;
}

// -----------------------------
// Store
// -----------------------------
export const auth = writable<AuthState>({
  access_token: null,
  exp: null,
  user_uuid: null,
  nickname: null
});

// 로그인 상태: Access Token이 유효하고 만료되지 않았는지 확인
export const isLoggedIn = derived(auth, ($auth) => {
  if (!$auth.access_token || !$auth.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return now < $auth.exp;
});

// 토큰 만료 여부: Access Token이 만료되었는지 확인
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
  // TODO: 쿠키에서 Refresh Token을 제거하는 추가적인 서버 요청이 필요할 수 있습니다.
}

let refreshing = false;

/**
 * 인증 상태를 초기화하거나 Access Token을 갱신합니다.
 * Access Token이 유효하지 않다면, 쿠키에 저장된 Refresh Token을 사용하여
 * SvelteKit 엔드포인트를 통해 새 Access Token을 요청합니다.
 * @param options - SvelteKit에서 제공하는 fetch 객체 (서버 사이드 렌더링에서 중요)
 */
export async function initAuth(options?: { fetch?: typeof fetch }) {
  const tokenState = get(auth);

  // 1. 이미 유효한 Access Token이 있고, 갱신 중이 아니라면 바로 종료
  if (tokenState.access_token && !get(isTokenExpired) && !refreshing) {
    return;
  }
  
  // 2. 갱신 요청이 이미 진행 중이라면 종료
  if (refreshing) return;
  
  refreshing = true;
  const myFetch = options?.fetch ?? fetch;

  try {
    // SvelteKit 엔드포인트로 새 Access Token을 요청
    // 'credentials: "include"'를 통해 브라우저가 자동으로
    // 쿠키(Refresh Token 포함)를 요청 헤더에 포함시켜 전송합니다.
    const res = await myFetch('/api/auth/token/access', {
      method: 'POST',
      // Access Token을 헤더에 넣는 로직은 삭제합니다.
      // Refresh는 쿠키에 있는 Refresh Token으로만 진행해야 합니다.
      credentials: 'include' 
    });

    if (!res.ok) {
      // 서버에서 Refresh Token이 없거나 만료되었다는 응답을 받으면 인증 정보 삭제
      clearAuth();
      return;
    }

    const data = await res.json();
    if (!data.access_token || typeof data.access_token !== 'string') {
      console.error("No access token returned from server", data);
      clearAuth();
      return;
    }
    
    // 새 Access Token 디코딩 및 Store 업데이트
    const decoded: any = jwtDecode(data.access_token);

    auth.set({
      access_token: data.access_token,
      exp: decoded.exp,
      user_uuid: decoded.user_uuid,
      nickname: decoded.nickname
    });
  } catch (e) {
    console.error("Access Token 갱신 중 오류 발생:", e);
    clearAuth();
  } finally {
    refreshing = false;
  }
}