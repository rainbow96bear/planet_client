// 파일 경로: src/routes/api/auth/token/access/+server.ts (개선)

import type { RequestHandler } from "@sveltejs/kit";
import { env } from '$env/dynamic/private'; 
// SvelteKit의 RequestHandler는 이제 { request, cookies } 객체를 받습니다.

const AUTH_SERVER_API_URL = env.VITE_AUTH_SERVER_API_URL; 
const REFRESH_COOKIE_NAME = 'refresh_token'; // Golang/클라이언트와 동일한 쿠키 이름

export const POST: RequestHandler = async ({ request, cookies }) => {
  
  // 1. HttpOnly 쿠키에서 Refresh Token 값만 추출
  const refreshToken = cookies.get(REFRESH_COOKIE_NAME);
  
  if (!refreshToken) {
    // Refresh Token이 없으면 즉시 401 반환 (클라이언트 Store가 로그아웃 처리)
    return new Response(JSON.stringify({ message: "Refresh token not found." }), { status: 401 });
  }

  // 2. Golang 서버로 전달할 헤더를 설정
  const proxyHeaders = new Headers();
  const contentTypeHeader = request.headers.get("content-type");

  // 🚨 핵심 변경: Refresh Token을 'Authorization' 헤더로 재구성 🚨
  proxyHeaders.set("Authorization", `Bearer ${refreshToken}`); 

  if (contentTypeHeader) {
    proxyHeaders.set("Content-Type", contentTypeHeader);
  }
  
  // 3. Golang Auth Server로 프록시 요청
  const res = await fetch(`${AUTH_SERVER_API_URL}/auth/token/access`, {
    method: "POST",
    headers: proxyHeaders, // 이제 Authorization 헤더를 사용합니다.
    body: request.body,
  });
  
  // 4. 백엔드에서 받은 응답 헤더(Set-Cookie 포함 가능)를 클라이언트로 전달
  const responseHeaders = new Headers();
  res.headers.forEach((value, key) => {
    responseHeaders.set(key, value);
  });
  
  // 5. 응답 본문을 클라이언트로 전달
  const responseBody = await res.text();
  
  return new Response(responseBody, {
    status: res.status,
    headers: responseHeaders,
  });
};