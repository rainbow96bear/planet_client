import type { RequestHandler } from "@sveltejs/kit";

const AUTH_SERVER_API_URL = process.env.VITE_AUTH_SERVER_API_URL;

export const POST: RequestHandler = async ({ request }) => {
  console.log("request issue access token");

  const res = await fetch(`${AUTH_SERVER_API_URL}/auth/token/issue/access`, {
    method: "POST",
    headers: {
      cookie: request.headers.get("cookie") || "", // ← 클라이언트 쿠키 직접 전달
    },
  });

  if (!res.ok) {
    return new Response(await res.text(), { status: res.status });
  }

  const data = await res.json();
  console.log(data);

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};