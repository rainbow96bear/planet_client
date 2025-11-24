// src/routes/api/user/theme/+server.ts
import type { RequestHandler } from '@sveltejs/kit';

const USER_SERVER_API_URL = process.env.VITE_USER_SERVER_API_URL;

// GET: 사용자 테마 조회
export const GET: RequestHandler = async ({ request }) => {
  try {
    const token = request.headers.get('authorization');
    const res = await fetch(`${USER_SERVER_API_URL}/me/theme`, {
      method: 'GET',
      headers: token ? { 'Authorization': token } : {},
    });

    const body = await res.text();
    const headers = new Headers(res.headers);

    return new Response(body, { status: res.status, headers });
  } catch (err) {
    console.error('GET /api/user/theme error:', err);
    return new Response(JSON.stringify({ error: '서버 내부 오류' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// POST: 사용자 테마 변경
export const POST: RequestHandler = async ({ request }) => {
  try {
    const token = request.headers.get('authorization');
    const data = await request.json();

    const res = await fetch(`${USER_SERVER_API_URL}/me/theme`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': token } : {}),
      },
      body: JSON.stringify(data),
    });

    const body = await res.text();
    const headers = new Headers(res.headers);

    return new Response(body, { status: res.status, headers });
  } catch (err) {
    console.error('POST /api/profile/theme error:', err);
    return new Response(JSON.stringify({ error: '서버 내부 오류' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
