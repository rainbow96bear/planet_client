import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { GET_PROFILE, UPDATE_PROFILE } from '$lib/graphql/profile.graphql';
import { env } from 'process';
import { graphqlRequest } from '$lib/server/graphqlRequest';
import { UnauthorizedError } from '$lib/server/errors';

const USER_SERVER_GRAPHQL = env.VITE_USER_SERVER_GRAPHQL!;

interface GetProfileResponse {
  myProfile: {
    id: string;
    nickname: string;
    bio: string | null;
    profileImage: string | null;
    theme: string;
    followerCount: number;
    followingCount: number;
  };
}

interface UpdateProfileResponse {
  updateProfile: {
    id: string;
    nickname: string;
    bio: string | null;
    profileImage: string | null;
    theme: string;
    followerCount: number;
    followingCount: number;
  };
}

/* ===============================
 * GET: 내 프로필 조회
 * =============================== */
export const GET: RequestHandler = async (event) => {
  try {
    if (!event.locals.user) {
      throw new UnauthorizedError();
    }

    const data = await graphqlRequest<GetProfileResponse>(
      event,
      USER_SERVER_GRAPHQL,
      GET_PROFILE,
      {}
    );
    return json(data.myProfile);
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error('GET /api/me/profile error:', err);
    return json({ error: '서버 내부 오류' }, { status: 500 });
  }
};

/* ===============================
 * PATCH: 내 프로필 수정
 * =============================== */
export const PATCH: RequestHandler = async (event) => {
  try {
    if (!event.locals.user) {
      throw new UnauthorizedError();
    }

    const body = await event.request.json();

    const variables = {
      input: {
        ...(body.nickname !== undefined && { nickname: body.nickname }),
        ...(body.bio !== undefined && { bio: body.bio }),
        ...(body.profileImage !== undefined && {
          profileImage: body.profileImage
        })
      }
    };

    const data = await graphqlRequest<UpdateProfileResponse>(
      event,
      USER_SERVER_GRAPHQL,
      UPDATE_PROFILE,
      variables
    );

    return json(data.updateProfile);
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.error('PATCH /api/me/profile error:', err);
    return json({ error: '서버 내부 오류' }, { status: 500 });
  }
};
