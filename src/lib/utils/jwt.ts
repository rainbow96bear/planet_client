import {jwtDecode} from 'jwt-decode';

interface TokenPayload {
  exp?: number; // UNIX timestamp (초 단위)
  [key: string]: any; // 다른 필드 허용
}

// src/lib/utils/jwt.ts
export function decodeJwt(token: string) {
  try {
    const payloadBase64 = token.split('.')[1];
    const payload = atob(payloadBase64);
    return JSON.parse(payload);
  } catch (e) {
    console.error("JWT decode 실패:", e);
    return null;
  }
}

/**
 * JWT access token 만료 여부 확인
 * @param token JWT 문자열
 * @returns true면 만료, false면 유효
 */
export function tokenIsExpired(token: string): boolean {
  if (!token) return true;
  try {
    const decoded = jwtDecode<TokenPayload>(token);
    if (!decoded.exp) return true; // exp 없으면 만료로 처리
    const expMs = decoded.exp * 1000; // ms 단위 변환
    return Date.now() > expMs;
  } catch (err) {
    console.warn('Failed to decode JWT:', err);
    return true; // 디코딩 실패 시 만료로 처리
  }
}