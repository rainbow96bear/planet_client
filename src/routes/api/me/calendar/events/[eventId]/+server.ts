import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { CREATE_CALENDAR_EVENT } from '$lib/graphql';
import { graphqlWithAuth } from '$lib/server/graphqlWithAuth';
import { DELETE_CALENDAR_EVENT, GET_MY_CALENDAR_EVENTS, UPDATE_CALENDAR_EVENT } from '$lib/graphql/calendar.graphql';

const USER_SERVER_GRAPHQL = process.env.VITE_USER_SERVER_GRAPHQL;

export const GET: RequestHandler = async (event) => {
  try {
    const eventId = event.params.eventId;

    const data = await graphqlWithAuth(
      USER_SERVER_GRAPHQL!,
      GET_MY_CALENDAR_EVENTS,
      { eventId },
      event
    );
    return json(data.myCalendarEvent);
  } catch (err) {
    console.error('GET /api/calendar/events/[eventId]', err);
    return json({ error: '조회 실패' }, { status: 500 });
  }
};

export const PUT: RequestHandler = async (event) => {
  try {
    const eventId = event.params.eventId;
    const input = await event.request.json();

    const data = await graphqlWithAuth(
      USER_SERVER_GRAPHQL!,
      UPDATE_CALENDAR_EVENT,
      { eventId, input },
      event
    );

    return json(data.updateCalendarEvent);
  } catch (err) {
    console.error('PUT /api/calendar/events/[eventId]', err);
    return json({ error: '수정 실패' }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async (event) => {
  try {
    const eventId = event.params.eventId;
    await graphqlWithAuth(
      USER_SERVER_GRAPHQL!,
      DELETE_CALENDAR_EVENT,
      { eventId },
      event
    );

    return json({ success: true });
  } catch (err) {
    console.error('DELETE /api/calendar/events/[eventId]', err);
    return json({ error: '삭제 실패' }, { status: 500 });
  }
};