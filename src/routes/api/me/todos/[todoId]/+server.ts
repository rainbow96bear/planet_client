import { UPDATE_TODO_DONE } from '$lib/graphql';
import { graphqlWithAuth } from '$lib/server/graphqlWithAuth';
import { error, json, type RequestHandler } from '@sveltejs/kit';

const USER_SERVER_GRAPHQL = process.env.VITE_USER_SERVER_GRAPHQL;


export const PATCH: RequestHandler = async (event) => {
  try {
    const { isDone } = await event.request.json();
    const todoId = event.params.todoId;
    if (!todoId) {
      return error(400, { message: 'todoId가 없습니다.' });
    }

    const data = await graphqlWithAuth(
      USER_SERVER_GRAPHQL!,
      UPDATE_TODO_DONE,
      {
        id: todoId,
        isDone,
      },
      event
    );

    return json(data.updateTodoDone);
  } catch (err: any) {
    console.error('PATCH /api/me/todos/[todoId]', err);

    if (err.message?.includes('unauthorized')) {
      return error(401, { message: '인증 실패' });
    }

    return error(500, { message: '내부 서버 오류' });
  }
};
