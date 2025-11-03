import type { RequestHandler } from '@sveltejs/kit';

const USER_SERVER_API_URL = process.env.VITE_USER_SERVER_API_URL;

// GET: 본인 일정 조회
export const GET: RequestHandler = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return new Response(JSON.stringify({ error: '로그인이 필요합니다.' }), { status: 401 });

  const res = await fetch(`${USER_SERVER_API_URL}/calendar`, {
    headers: { Authorization: authHeader },
  });

  if (!res.ok) return new Response(JSON.stringify({ error: '조회 실패' }), { status: res.status });

  const data = await res.json();
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
};

// POST: 새 일정 등록
export const POST: RequestHandler = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return new Response(JSON.stringify({ error: '로그인이 필요합니다.' }), { status: 401 });

  const formData = await request.formData();

  const res = await fetch(`${USER_SERVER_API_URL}/calendar`, {
    method: 'POST',
    headers: { Authorization: authHeader },
    body: formData,
  });

  if (!res.ok) return new Response(JSON.stringify({ error: '등록 실패' }), { status: res.status });

  const data = await res.json();
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
};
