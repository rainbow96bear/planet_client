import type { RequestHandler } from "@sveltejs/kit";

const AUTH_SERVER_API_URL = process.env.VITE_AUTH_SERVER_API_URL;

export const GET: RequestHandler = async ({ url }) => {
  const nickname = url.searchParams.get("nickname");

  if (!nickname || nickname.trim().length < 2) {
    return new Response(JSON.stringify({ available: false, error: "invalid nickname" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const res = await fetch(`${AUTH_SERVER_API_URL}/auth/user/nickname/check?nickname=${encodeURIComponent(nickname)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ available: false, error: "server error" }), { status: 500 });
  }
};
