// src/routes/api/users/[nickname]/calendar/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import { graphqlRequest } from '$lib/server/graphqlRequest';
import { GET_CALENDAR_EVENTS } from '$lib/graphql/calendar.graphql';

const GRAPHQL_URL = process.env.VITE_USER_SERVER_GRAPHQL!;

export const GET: RequestHandler = async (event) => {
  try {
    const { params, url } = event;
    const { nickname } = params;

    if (!nickname) {
      return error(400, { message: 'nickname이 필요합니다.' });
    }

    const year = Number(url.searchParams.get('year'));
    const month = Number(url.searchParams.get('month'));

    if (!year || !month) {
      return error(400, { message: 'year, month 쿼리가 필요합니다.' });
    }

    const data = await graphqlRequest<{
      calendarEvents: any[];
    }>(
      event,                // ✅ 여기 중요
      GRAPHQL_URL,
      GET_CALENDAR_EVENTS,
      {
        userId: nickname,   // 또는 nickname → userId 매핑
        year,
        month,
      }
    );

    return json(data.calendarEvents);
  } catch (err) {
    console.error('GET /api/users/[nickname]/calendar', err);
    return error(500, { message: '서버 내부 오류' });
  }
};
