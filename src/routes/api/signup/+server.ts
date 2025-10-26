// src/routes/api/signup/+server.ts
import type { RequestHandler } from "@sveltejs/kit";

const AUTH_SERVER_API_URL = process.env.VITE_AUTH_SERVER_API_URL;

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();

    // Golang 백엔드로 요청 (쿠키 전달)
    const res = await fetch(`${AUTH_SERVER_API_URL}/auth/user/signup`, {
      method: "POST",
      body: formData,
      headers: {
        cookie: request.headers.get("cookie") || ""
      },
      redirect: "manual" // Golang 302 redirect 자동으로 따라가지 않도록
    });

    // Golang에서 내려주는 Set-Cookie 헤더 복사
    const headers = new Headers();
    res.headers.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        headers.append("Set-Cookie", value);
      } else {
        headers.append(key, value);
      }
    });

    // 상태 코드와 body 그대로 전달
    const body = await res.text(); // JSON 또는 redirect 메시지
    return new Response(body, {
      status: res.status,
      headers
    });
  } catch (err) {
    console.error("Internal server error:", err);
    return new Response(JSON.stringify({ error: "서버 내부 오류" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
