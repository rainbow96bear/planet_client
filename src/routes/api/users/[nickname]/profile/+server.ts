  import type { RequestHandler } from "@sveltejs/kit";
  import type { UserProfile } from '$lib/types/profile';
  // planet_user_server로 profile 정보 요청
  const USER_SERVER_API_URL = process.env.VITE_USER_SERVER_API_URL;

  export const GET: RequestHandler = async (event) => {
    const res = await event.fetch(`${USER_SERVER_API_URL}/users/${event.params.nickname}/profile`, {
      method:"GET",
    });
  
    if (!res.ok)
      return new Response(JSON.stringify({ error: 'profile not found' }), { status: res.status });

    const data: UserProfile = await res.json();
    return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
  };
