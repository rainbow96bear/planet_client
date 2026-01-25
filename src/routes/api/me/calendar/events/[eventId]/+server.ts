// src/routes/api/calendar/events/[eventId]/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import {
  GET_CALENDAR_EVENT,
  UPDATE_CALENDAR_EVENT,
  DELETE_CALENDAR_EVENT
} from '$lib/graphql/calendar.graphql';
import { graphqlRequest } from '$lib/server/graphqlRequest';

const USER_SERVER_GRAPHQL = process.env.VITE_USER_SERVER_GRAPHQL!;

export const GET: RequestHandler = async (event) => {
  try {
    const { eventId } = event.params;

    if (!eventId) {
      return error(400, { message: 'eventId가 필요합니다.' });
    }

    const data = await graphqlRequest<{
      myCalendarEvent: any;
    }>(
      event,
      USER_SERVER_GRAPHQL,
      GET_CALENDAR_EVENT,
      { eventId }
    );

    return json(data.myCalendarEvent);
  } catch (err: any) {
    console.error('GET /api/calendar/events/[eventId]', err);

    if (err.message?.includes('unauthorized')) {
      return error(401, { message: '인증 실패' });
    }

    return error(500, { message: '일정 조회 실패' });
  }
};

export const PUT: RequestHandler = async (event) => {
  try {
    const { eventId } = event.params;

    if (!eventId) {
      return error(400, { message: 'eventId가 필요합니다.' });
    }

    const input = await event.request.json();

    const data = await graphqlRequest<{
      updateCalendarEvent: any;
    }>(
      event,
      USER_SERVER_GRAPHQL,
      UPDATE_CALENDAR_EVENT,
      { eventId, input }
    );

    return json(data.updateCalendarEvent);
  } catch (err: any) {
    console.error('PUT /api/calendar/events/[eventId]', err);

    if (err.message?.includes('unauthorized')) {
      return error(401, { message: '인증 실패' });
    }

    return error(500, { message: '일정 수정 실패' });
  }
};

export const DELETE: RequestHandler = async (event) => {
  try {
    const { eventId } = event.params;

    if (!eventId) {
      return error(400, { message: 'eventId가 필요합니다.' });
    }

    await graphqlRequest(
      event,
      USER_SERVER_GRAPHQL,
      DELETE_CALENDAR_EVENT,
      { eventId }
    );

    return json({ success: true });
  } catch (err: any) {
    console.error('DELETE /api/calendar/events/[eventId]', err);

    if (err.message?.includes('unauthorized')) {
      return error(401, { message: '인증 실패' });
    }

    return error(500, { message: '일정 삭제 실패' });
  }
};
