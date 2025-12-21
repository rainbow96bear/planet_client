import type { Handle } from '@sveltejs/kit';
import { graphqlRequest } from '$lib/server/graphqlClient';
import { ISSUE_ACCESS_TOKEN } from '$lib/graphql';

const AUTH_SERVER_GRAPHQL = process.env.VITE_AUTH_SERVER_GRAPHQL!;
const REFRESH_COOKIE_NAME = process.env.REFRESH_TOKEN_COOKIE_NAME || 'refreshToken';
const AT_EXPIRES_KEY = process.env.VITE_AT_EXPIRES_KEY || 'at_expires_at';

export const handle: Handle = async ({ event, resolve }) => {
  const refreshToken = event.cookies.get(REFRESH_COOKIE_NAME);
  const expiresAt = event.cookies.get(AT_EXPIRES_KEY);

  const now = Date.now();

  // access token이 아직 유효한 경우
  if (event.locals.accessToken && expiresAt && Number(expiresAt) > now) {
    return resolve(event);
  }

  // refresh token 없으면 그냥 통과
  if (!refreshToken) {
    return resolve(event);
  }

  // access token 없거나 만료 → 재발급
  try {
    const data = await graphqlRequest<{
      issueAccessToken: { accessToken: string; expiresAt: string }
    }>(AUTH_SERVER_GRAPHQL, ISSUE_ACCESS_TOKEN, { refreshToken });

    const payload = data.issueAccessToken;
    const newExpiresAt = new Date(payload.expiresAt).getTime();

    event.locals.accessToken = payload.accessToken;

    event.cookies.set(AT_EXPIRES_KEY, String(newExpiresAt), {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
  } catch (err) {
    // refresh 실패 → 쿠키 정리
    const cookieOptions = {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    } as const;

    event.cookies.delete(REFRESH_COOKIE_NAME, cookieOptions);
    event.cookies.delete(AT_EXPIRES_KEY, cookieOptions);
  }

  return resolve(event);
};