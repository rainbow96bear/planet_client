import { UPDATE_TODO_DONE } from '$lib/graphql';
import { graphqlRequest } from '$lib/server/graphqlRequest';
import { error, json, type RequestHandler } from '@sveltejs/kit';

const USER_SERVER_GRAPHQL = process.env.VITE_USER_SERVER_GRAPHQL!;

type UpdateTodoDoneResponse = {
  updateTodoDone: {
    id: string;
    isDone: boolean;
  };
};

export const PATCH: RequestHandler = async (event) => {
  try {
    const { params, request } = event;

    const todoId = params.todoId;
    if (!todoId) {
      throw error(400, 'todoId가 없습니다.');
    }

    const { isDone } = await request.json();
    if (typeof isDone !== 'boolean') {
      throw error(400, 'isDone 값이 올바르지 않습니다.');
    }

    const data = await graphqlRequest<UpdateTodoDoneResponse>(
      event,
      USER_SERVER_GRAPHQL,
      UPDATE_TODO_DONE,
      {
        id: todoId,
        isDone
      }
    );

    return json(data.updateTodoDone, { status: 200 });

  } catch (err: any) {
    console.error('PATCH /api/me/todos/[todoId]', err);

    if (err?.status) {
      throw err; // error(400), error(401) 그대로 전달
    }

    if (err.message?.includes('unauthorized')) {
      throw error(401, '인증 실패');
    }

    throw error(500, '내부 서버 오류');
  }
};
