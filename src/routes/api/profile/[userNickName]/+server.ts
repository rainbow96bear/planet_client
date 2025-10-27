import type { RequestHandler } from './$types';
import type { UserProfile } from '$lib/types/profile';
// planet_user_server로 profile 정보 요청
const USER_SERVER_API_URL = process.env.VITE_USER_SERVER_API_URL;

export const GET: RequestHandler = async ({ params }) => {
  console.log(params.userNickName)
  const res = await fetch(`${USER_SERVER_API_URL}/profile/${params.userNickName}`, {
    method:"GET",
  });
 
  if (!res.ok)
    return new Response(JSON.stringify({ error: 'profile not found' }), { status: res.status });

  const data: UserProfile = await res.json();
   console.log("profile res : ",JSON.stringify(data))
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
};
