// src/routes/api/calendar/+server.ts
import { json, type RequestHandler } from '@sveltejs/kit';
import { graphqlRequest } from '$lib/server/graphqlRequest';
import { GET_CALENDAR_EVENTS } from '$lib/graphql/calendar.graphql';

const GRAPHQL_URL = process.env.VITE_USER_SERVER_GRAPHQL!;

export const GET: RequestHandler = async (event) => {
  const { url } = event;

  const userId = url.searchParams.get('userId');
  const year = Number(url.searchParams.get('year'));
  const month = Number(url.searchParams.get('month'));

  if (!userId || !year || !month) {
    return json(
      { error: 'userId, year, month 필요' },
      { status: 400 }
    );
  }

  const data = await graphqlRequest<{
    calendarEvents: any[];
  }>(
    event,
    GRAPHQL_URL,
    GET_CALENDAR_EVENTS,
    { userId, year, month }
  );

  return json(data.calendarEvents);
};
