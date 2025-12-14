import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { graphqlWithAuth } from '$lib/server/graphqlWithAuth';
import { GET_PROFILE, UPDATE_PROFILE } from '$lib/graphql/profile.graphql';
import { env } from 'process';

const USER_SERVER_GRAPHQL = env.VITE_USER_SERVER_GRAPHQL;

// GET: 사용자 프로필 조회
export const GET: RequestHandler = async ( event ) => {
  try {
    const data = await graphqlWithAuth(
      USER_SERVER_GRAPHQL!, 
      GET_PROFILE, 
      {}, 
      event
    );
    return json(data.myProfile, { status: 200 });
  } catch (err) {
    console.error('GET /api/me/profile error:', err);
    return json({ error: '서버 내부 오류' }, { status: 500 });
  }
};

// PATCH: 사용자 프로필 업데이트
export const PATCH: RequestHandler = async (event) => { 
  try {
    // 1. request 객체는 event.request로 접근
    const body = await event.request.json();

    const variables = {
      input: {
        nickname: body.nickname,
        bio: body.bio,
        profileImage: body.profileImage,
      }
    };
    // 2. graphqlWithAuth에 event 객체 전체를 전달 (cookies와 locals 포함)
    const data = await graphqlWithAuth(
      USER_SERVER_GRAPHQL!, 
      UPDATE_PROFILE, 
      variables, 
      event // Context로 event 객체 전체를 전달
    );

    return json(data.updateProfile, { status: 200 });
  } catch (err) {
    console.error('PATCH /api/me/profile error:', err);
    return json({ error: '서버 내부 오류' }, { status: 500 });
  }
};
