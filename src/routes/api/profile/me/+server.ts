import type { RequestHandler } from "@sveltejs/kit";
import type { UserProfile } from '$lib/types/profile';
// planet_user_server로 profile 정보 요청
const USER_SERVER_API_URL = process.env.VITE_USER_SERVER_API_URL;

// SvelteKit 서버 (src/routes/api/user/me/+server.ts)
export const GET: RequestHandler = async ({ request }) => {
  try {
    const token = request.headers.get("authorization");
    console.log(token)
    const res = await fetch(`${USER_SERVER_API_URL}/profile/me`, {
        method: "GET",
        headers: token ? { 'Authorization': token } : {},
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error('GET /api/profile/me error:', err);
    return new Response(JSON.stringify({ error: '서버 내부 오류' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
