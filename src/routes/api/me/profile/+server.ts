import type { RequestHandler } from "@sveltejs/kit";
import type { UserProfile } from '$lib/types/profile';
// planet_user_server로 profile 정보 요청
const USER_SERVER_API_URL = process.env.VITE_USER_SERVER_API_URL;

export const GET: RequestHandler = async ({ request }) => {
  try {
    const token = request.headers.get("authorization");
    const res = await fetch(`${USER_SERVER_API_URL}/me/profile`, {
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

export const PATCH: RequestHandler = async ({ params }) => {
  const res = await fetch(`${USER_SERVER_API_URL}/me/profile`, {
    method:"PATCH",
  });
 
  if (!res.ok)
    return new Response(JSON.stringify({ error: 'profile not found' }), { status: res.status });

  const data: UserProfile = await res.json();
   console.log("profile res : ",JSON.stringify(data))
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
};