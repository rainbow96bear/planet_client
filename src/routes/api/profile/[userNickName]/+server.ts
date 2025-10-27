import type { RequestHandler } from './$types';
import type { UserProfile } from '$lib/types/profile';

export const GET: RequestHandler = async ({ params, cookies }) => {
  const res = await fetch(`http://localhost:8080/api/profile/${params.userNickName}`, {
    headers: { 'Authorization': `Bearer ${cookies.get('access_token') || ''}` }
  });

  if (!res.ok)
    return new Response(JSON.stringify({ error: 'profile not found' }), { status: res.status });

  const data: UserProfile = await res.json();
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
};
