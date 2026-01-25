// src/routes/api/calendar/[eventId]/+server.ts
import { json, type RequestHandler } from '@sveltejs/kit';
import { graphqlRequest } from '$lib/server/graphqlRequest';
import {
  GET_CALENDAR_EVENT,
  UPDATE_CALENDAR_EVENT,
  DELETE_CALENDAR_EVENT
} from '$lib/graphql/calendar.graphql';

const GRAPHQL_URL = process.env.VITE_USER_SERVER_GRAPHQL!;

export const GET: RequestHandler = async (event) => {
  const eventId = event.params.eventId;

  const data = await graphqlRequest<{
      calendarEvent: any;
    }>(
    event,
    GRAPHQL_URL,
    GET_CALENDAR_EVENT,
    { eventId }
  );

  return json(data.calendarEvent);
};

export const PUT: RequestHandler = async (event) => {
  const eventId = event.params.eventId;
  const input = await event.request.json();

  const data = await graphqlRequest<{
      updateCalendarEvent: any;
    }>(
    event,
    GRAPHQL_URL,
    UPDATE_CALENDAR_EVENT,
    { eventId, input }
  );

  return json(data.updateCalendarEvent);
};

export const DELETE: RequestHandler = async (event) => {
  const eventId = event.params.eventId;

  await graphqlRequest(
    event,
    GRAPHQL_URL,
    DELETE_CALENDAR_EVENT,
    { eventId }
  );

  return json({ success: true });
};
