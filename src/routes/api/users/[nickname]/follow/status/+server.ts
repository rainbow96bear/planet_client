import type { RequestHandler } from "@sveltejs/kit";

const USER_SERVER_API_URL = process.env.VITE_USER_SERVER_API_URL;

export const GET: RequestHandler = async ({ params, request }) => {
  // params.userNickName 타입이 string | undefined
  const nickname: string = params.nickname ?? '';

  const authHeader = request.headers.get('authorization') || '';

  const res = await fetch(`${USER_SERVER_API_URL}/users/${nickname}/follow/status`, {
    method: 'GET',
    headers: {
      Authorization: authHeader
    }
  });

  const data = await res.json();

  return new Response(JSON.stringify({ is_following: data.is_following }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

