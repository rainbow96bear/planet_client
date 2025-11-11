import type { RequestHandler } from '@sveltejs/kit';

const USER_SERVER_API_URL = process.env.VITE_USER_SERVER_API_URL;

// GET: 본인 일정 조회 (한 달 단위)
export const GET: RequestHandler = async ({ request }) => {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: '로그인이 필요합니다.' }), { status: 401 });
  }

  // 쿼리 파라미터 받기
  const url = new URL(request.url);
  const year = url.searchParams.get('year');
  const month = url.searchParams.get('month');

  if (!year || !month) {
    return new Response(JSON.stringify({ error: 'year과 month 쿼리 필요' }), { status: 400 });
  }

  // 백엔드 API 호출 시 쿼리 포함
  const apiUrl = `${USER_SERVER_API_URL}/calendar?year=${year}&month=${month}`;

  const res = await fetch(apiUrl, {
    headers: { Authorization: authHeader },
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: '조회 실패' }), { status: res.status });
  }

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
