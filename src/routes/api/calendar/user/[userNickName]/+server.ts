import type { RequestHandler } from '@sveltejs/kit';

const USER_SERVER_API_URL = process.env.VITE_USER_SERVER_API_URL;

export const GET: RequestHandler = async ({ params }) => {
  const res = await fetch(`${USER_SERVER_API_URL}/calendar/user/${params.userNickname}`, { method: 'GET' });

  if (!res.ok) return new Response(JSON.stringify({ error: '조회 실패' }), { status: res.status });

  const data = await res.json();
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
};
