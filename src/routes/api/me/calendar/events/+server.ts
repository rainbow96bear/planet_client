import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { CREATE_CALENDAR_EVENT } from '$lib/graphql';
import { graphqlWithAuth } from '$lib/server/graphqlWithAuth';
const USER_SERVER_GRAPHQL = process.env.VITE_USER_SERVER_GRAPHQL;

// POST: 새 일정 등록

export const POST: RequestHandler = async (event) => {
  try {
    const input = await event.request.json();
    const data = await graphqlWithAuth(
      USER_SERVER_GRAPHQL!,
      CREATE_CALENDAR_EVENT,
      { input },
      event
    );

    return json(data.createCalendar, { status: 201 });
  } catch (err) {
    console.error('POST /api/me/calendar error:', err);
    return json({ error: '서버 내부 오류' }, { status: 500 });
  }
};
