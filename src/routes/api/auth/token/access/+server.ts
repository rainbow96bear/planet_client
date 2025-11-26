import type { RequestHandler } from "@sveltejs/kit";

const AUTH_SERVER_API_URL = process.env.VITE_AUTH_SERVER_API_URL;

export const POST: RequestHandler = async ({ request }) => {
  // 클라이언트의 모든 요청 헤더(쿠키 포함)를 복사
  const headers = new Headers();
  request.headers.forEach((value, key) => {
    headers.set(key, value);
  });
  
  // 클라이언트의 쿠키를 백엔드 Auth Server로 전달
  // initAuth에서 'credentials: "include"'로 요청하면,
  // request.headers.get("cookie")에 Refresh Token이 포함된 쿠키가 들어있습니다.
  
  const res = await fetch(`${AUTH_SERVER_API_URL}/auth/token/access`, {
    method: "POST",
    headers: headers, // 클라이언트의 모든 헤더(쿠키 포함)를 전달
  });

  if (!res.ok) {
    // 갱신 실패 시
    return new Response(await res.text(), { 
        status: res.status,
        headers: { "Content-Type": "application/json" }
    });
  }
  
  const data = await res.json();
  
  // 백엔드에서 받은 응답 헤더(새 Refresh Token 쿠키 포함 가능)를 클라이언트로 전달
  const responseHeaders = new Headers();
  res.headers.forEach((value, key) => {
    // Set-Cookie 헤더를 포함하여 전달해야 새 Refresh Token이 저장됩니다.
    responseHeaders.set(key, value);
  });
  
  // 새 Access Token을 클라이언트로 응답
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: responseHeaders, // 백엔드에서 받은 헤더(Set-Cookie 포함)를 사용
  });
};