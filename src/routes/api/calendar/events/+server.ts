// src/routes/api/me/calendar/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import { CREATE_CALENDAR_EVENT } from '$lib/graphql/calendar.graphql';
import { graphqlRequest } from '$lib/server/graphqlRequest';

const USER_SERVER_GRAPHQL = process.env.VITE_USER_SERVER_GRAPHQL!;

type CreateCalendarInput = {
  title: string;
  emoji?: string;
  description?: string;
  startAt: string;
  endAt: string;
  visibility?: 'public' | 'friends' | 'private';
  todos?: {
    content: string;
  }[];
};

export const POST: RequestHandler = async (event) => {
  try {
    const input: CreateCalendarInput = await event.request.json();

    // ✅ 최소 검증
    if (!input.title || !input.startAt || !input.endAt) {
      return error(400, {
        message: 'title, startAt, endAt은 필수입니다.'
      });
    }

    const data = await graphqlRequest<{
      createCalendarEvent: any;
    }>(
      event,
      USER_SERVER_GRAPHQL,
      CREATE_CALENDAR_EVENT,
      { input }
    );

    return json(data.createCalendarEvent, { status: 201 });

  } catch (err: any) {
    console.error('POST /api/calendar error:', err);

    // 인증 문제는 명확히
    if (err.message?.toLowerCase().includes('unauthorized')) {
      return error(401, { message: '인증이 필요합니다.' });
    }

    return error(500, { message: '서버 내부 오류' });
  }
};
