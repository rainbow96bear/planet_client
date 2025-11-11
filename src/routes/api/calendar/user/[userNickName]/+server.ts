import type { RequestHandler } from '@sveltejs/kit';

const USER_SERVER_API_URL = process.env.VITE_USER_SERVER_API_URL;

export const GET: RequestHandler = async ({ params, url }) => {
  const userNickName = params.userNickName;

  // year, month 쿼리 파라미터 가져오기
  const year = url.searchParams.get('year');
  const month = url.searchParams.get('month');

  if (!year || !month) {
    return new Response(JSON.stringify({ error: 'year과 month 쿼리 필요' }), { status: 400 });
  }

  // 백엔드 API 호출 시 쿼리 붙이기
  const apiUrl = `${USER_SERVER_API_URL}/calendar/user/${userNickName}?year=${year}&month=${month}`;

  const res = await fetch(apiUrl, { method: 'GET' });

  if (!res.ok) return new Response(JSON.stringify({ error: '조회 실패' }), { status: res.status });
  const data = await res.json();
  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } });
};
