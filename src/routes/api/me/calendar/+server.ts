import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { graphqlWithAuth } from '$lib/server/graphqlWithAuth';
import { GET_MY_CALENDAR_EVENTS } from '$lib/graphql';

const USER_SERVER_GRAPHQL = process.env.VITE_USER_SERVER_GRAPHQL;

export const GET: RequestHandler = async (event) => {
  try {
    const url = new URL(event.request.url);
    const year = Number(url.searchParams.get('year'));
    const month = Number(url.searchParams.get('month'));

    if (!year || !month) {
      return json({ error: 'year, month 필요' }, { status: 400 });
    }

    const data = await graphqlWithAuth(
      USER_SERVER_GRAPHQL!,
      GET_MY_CALENDAR_EVENTS,
      { year, month },
      event
    );
    return json(data.myCalendarEvents, { status: 200 });
  } catch (err) {
    console.error('GET /api/me/calendar error:', err);
    return json({ error: '서버 내부 오류' }, { status: 500 });
  }
};