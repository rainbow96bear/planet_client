import type { RequestHandler } from './$types';
import type { Feed } from '$lib/types/profile';

export const GET: RequestHandler = async ({ params, cookies }) => {
  const res = await fetch(`http://localhost:8080/api/profile/${params.userNickName}/feeds`, {
    headers: { 'Authorization': `Bearer ${cookies.get('access_token') || ''}` }
  });

  if (!res.ok)
    return new Response(JSON.stringify([]), { status: res.status });

  const data: Feed[] = await res.json();
  return new Response(JSON.stringify(data));
};
