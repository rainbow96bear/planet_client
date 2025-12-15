import { json, type RequestHandler } from '@sveltejs/kit';
import { graphqlWithAuth } from '$lib/server/graphqlWithAuth';
import { GET_MY_CALENDAR_DAILY_EVENT } from '$lib/graphql';
import { env } from 'process';

const USER_SERVER_GRAPHQL = env.VITE_USER_SERVER_GRAPHQL;

function toRFC3339Nano(dateString: string) {
  const date = new Date(dateString);
  return date.toISOString();
}

export const GET: RequestHandler = async (event) => {
  const dateString = event.url.searchParams.get('date');
  if (!dateString) {
    return json({ error: 'date 쿼리 파라미터가 필요합니다.' }, { status: 400 });
  }

  try {
    const data = await graphqlWithAuth(
      USER_SERVER_GRAPHQL!,
      GET_MY_CALENDAR_DAILY_EVENT,
      { date: toRFC3339Nano(dateString) },
      event
    );
    return json({ dailyPlans: data.myCalendarEventsByDate });
  } catch (err) {
    console.error('GET /api/me/plans/daily error:', err);
    return json({ error: '서버 내부 오류' }, { status: 500 });
  }
};
