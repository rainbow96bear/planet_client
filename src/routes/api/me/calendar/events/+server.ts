import type { RequestHandler } from '@sveltejs/kit';

const USER_SERVER_API_URL = process.env.VITE_USER_SERVER_API_URL;

// POST: 새 일정 등록
export const POST: RequestHandler = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: '로그인이 필요합니다.' }), {
      status: 401
    });
  }

  // JSON 요청 파싱
  const jsonData = await request.json();

  // 백엔드 서버로 JSON 그대로 전달
  const res = await fetch(`${USER_SERVER_API_URL}/me/calendar/events`, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jsonData)   // ← 여기 반드시 stringify 필요
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: '등록 실패' }), {
      status: res.status
    });
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
};