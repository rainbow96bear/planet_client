import type { RequestHandler } from '@sveltejs/kit';

const USER_SERVER_API_URL = process.env.VITE_USER_SERVER_API_URL;


export const PUT: RequestHandler = async ({ request, params }) => {
  const formData = await request.formData();
  const eventId = params.eventId;

  const res = await fetch(`${USER_SERVER_API_URL}/me/calendar/events/${eventId}`, { 
    method: 'PUT',
    headers: { Authorization: request.headers.get('authorization')! }, // 이미 hooks에서 유효성 확인됨
    body: formData
  });

  if (!res.ok) return new Response(JSON.stringify({ error: '수정 실패' }), { status: res.status });

  const data = await res.json();
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
};

export const DELETE: RequestHandler = async ({ request, params }) => {
  const eventId = params.eventId;

  // Authorization 헤더는 hooks에서 유효성 확인 후 그대로 전달
  const res = await fetch(`${USER_SERVER_API_URL}/me/calendar/events/${eventId}`, {
    method: 'DELETE',
    headers: { Authorization: request.headers.get('authorization')! },
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: '삭제 실패' }), { status: res.status });
  }

  return new Response(JSON.stringify({ success: true }), { headers: { 'Content-Type': 'application/json' } });
};
