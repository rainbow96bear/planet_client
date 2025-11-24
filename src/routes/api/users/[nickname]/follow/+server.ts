// src/routes/api/users/[nickname]/follow/+server.ts
import type { RequestHandler } from '@sveltejs/kit';

const USER_SERVER_API_URL = process.env.VITE_USER_SERVER_API_URL;

// 팔로우 요청
export const POST: RequestHandler = async ({ params, request }) => {
  const nickname = params.nickname; 
  if (!nickname) {
    return new Response(JSON.stringify({ error: 'nickname required' }), { status: 400 });
  }

  const authHeader = request.headers.get('authorization') ?? '';

  const res = await fetch(`${USER_SERVER_API_URL}/users/${nickname}/follow`, {
    method: 'POST',
    headers: { Authorization: authHeader }
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' }
  });
};

// 언팔로우 요청
export const DELETE: RequestHandler = async ({ params, request }) => {
  const nickname = params.nickname;
  if (!nickname) {
    return new Response(JSON.stringify({ error: 'nickname required' }), { status: 400 });
  }

  const authHeader = request.headers.get('authorization') ?? '';

  const res = await fetch(`${USER_SERVER_API_URL}/users/${nickname}/follow`, {
    method: 'DELETE',
    headers: { Authorization: authHeader }
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' }
  });
};
