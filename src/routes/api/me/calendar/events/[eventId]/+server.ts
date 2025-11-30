import type { RequestHandler } from '@sveltejs/kit';

const USER_SERVER_API_URL = process.env.VITE_USER_SERVER_API_URL;

export const GET: RequestHandler = async ({ request, params }) => {
  const eventId = params.eventId;
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: '로그인이 필요합니다.' }), { status: 401 });
  }

  // 백엔드 API 호출 시 쿼리 포함
  const apiUrl = `${USER_SERVER_API_URL}/me/calendar/events/${eventId}`;

  const res = await fetch(apiUrl, {
    headers: { Authorization: authHeader },
  });
  
  if (!res.ok) {
    return new Response(JSON.stringify({ error: '조회 실패' }), { status: res.status });
  }

  const data = await res.json();
console.log(data)
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
};

export const PUT: RequestHandler = async ({ request, params }) => {
  const eventId = params.eventId;
  const authHeader = request.headers.get('authorization');

  // 1. 클라이언트의 요청 본문을 JSON으로 파싱합니다.
  //    클라이언트 (CalendarForm)가 JSON을 보내고 있다고 가정합니다.
  const jsonData = await request.json(); // 👈 request.formData() 대신 사용

  // 2. 백엔드 서버로 JSON 형식 그대로 전달합니다.
  const res = await fetch(`${USER_SERVER_API_URL}/me/calendar/events/${eventId}`, {
    method: 'PUT',
    headers: {
      Authorization: authHeader!, // 이미 hooks에서 유효성 확인됨
      'Content-Type': 'application/json' // 👈 JSON임을 명시
    },
    body: JSON.stringify(jsonData) // 👈 JSON 문자열로 변환하여 전달
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: '수정 실패' }));
    return new Response(JSON.stringify(errorData), { status: res.status });
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), { 
    headers: { 'Content-Type': 'application/json' } 
  });
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
