// src/routes/api/user/theme/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { UPDATE_PROFILE_THEME } from '$lib/graphql';
import { graphqlWithAuth } from '$lib/server/graphqlWithAuth';

const USER_SERVER_GRAPHQL = process.env.VITE_USER_SERVER_GRAPHQL;



export const PATCH: RequestHandler = async (event) => {
  try {
    const authHeader = event.request.headers.get('authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: '인증 실패: 토큰 없음' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await event.request.json();

    const variables = {
      input: {
        theme: body.theme   // 🎯 유저가 변경할 테마
      }
    };

    const data = await graphqlWithAuth(
      USER_SERVER_GRAPHQL!,
      UPDATE_PROFILE_THEME,
      variables,
      event
    );

    return new Response(JSON.stringify(data.updateProfile), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('PATCH /api/me/theme error:', err);
    return new Response(JSON.stringify({ error: '서버 내부 오류' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
