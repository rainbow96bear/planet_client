import type { RequestHandler } from '@sveltejs/kit';

const USER_SERVER_API_URL = process.env.VITE_USER_SERVER_API_URL;

// PUT: 일정 수정
export const PUT: RequestHandler = async ({ request, params }) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return new Response(JSON.stringify({ error: '로그인이 필요합니다.' }), { status: 401 });

  const formData = await request.formData();
  const eventId = params.eventId;

  const res = await fetch(`${USER_SERVER_API_URL}/calendar/${eventId}`, {
    method: 'PUT',
    headers: { Authorization: authHeader },
    body: formData
  });

  if (!res.ok) return new Response(JSON.stringify({ error: '수정 실패' }), { status: res.status });

  const data = await res.json();
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
};

// DELETE: 일정 삭제
export const DELETE: RequestHandler = async ({ request, params }) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return new Response(JSON.stringify({ error: '로그인이 필요합니다.' }), { status: 401 });

  const eventId = params.eventId;
  const res = await fetch(`${USER_SERVER_API_URL}/calendar/${eventId}`, {
    method: 'DELETE',
    headers: { Authorization: authHeader },
  });

  if (!res.ok) return new Response(JSON.stringify({ error: '삭제 실패' }), { status: res.status });

  return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
};
