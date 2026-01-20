// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import { graphqlRequest } from '$lib/server/graphqlClient';
import { ISSUE_ACCESS_TOKEN } from '$lib/graphql';
import { randomUUID } from 'crypto';
import { verifyJwt } from '$lib/server/jwt';

const AUTH_SERVER_GRAPHQL = process.env.VITE_AUTH_SERVER_GRAPHQL!;

const CLIENT_ID_COOKIE = process.env.VITE_CLIENT_ID_COOKIE || 'client_id';
const ACCESS_COOKIE = 'accessToken';
const REFRESH_COOKIE = process.env.VITE_REFRESH_TOKEN_COOKIE_NAME || 'refreshToken';

const ONE_YEAR = 60 * 60 * 24 * 365;

export const handle: Handle = async ({ event, resolve }) => {
  /* ===============================
   * 1. client_id 보장
   * =============================== */
  let clientId = event.cookies.get(CLIENT_ID_COOKIE);

  if (!clientId) {
    clientId = randomUUID();
    event.cookies.set(CLIENT_ID_COOKIE, clientId, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: ONE_YEAR
    });
  }

  event.locals.clientId = clientId;

  /* ===============================
   * 2. access token 검증
   * =============================== */
  let accessToken = event.cookies.get(ACCESS_COOKIE);

  if (accessToken) {
    try {
      const payload = verifyJwt(accessToken);
      event.locals.user = { id: payload.sub, role: payload.role };
      event.locals.accessToken = accessToken; // endpoint에서 접근 가능
    } catch {
      // access token 만료/위조 → 삭제하고 refresh 시도
      event.cookies.delete(ACCESS_COOKIE, { path: '/' });
      accessToken = undefined;
    }
  }

  /* ===============================
   * 3. refresh token으로 access token 재발급
   * =============================== */
  if (!accessToken) {
    const refreshToken = event.cookies.get(REFRESH_COOKIE);
    if (refreshToken) {
      try {
        const data = await graphqlRequest<{
          issueAccessToken: {
            accessToken: string;
            expiresAt: string;
          };
        }>(AUTH_SERVER_GRAPHQL, ISSUE_ACCESS_TOKEN, { refreshToken });

        const { accessToken: newAccessToken, expiresAt } = data.issueAccessToken;

        event.cookies.set(ACCESS_COOKIE, newAccessToken, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          expires: new Date(expiresAt)
        });

        const payload = verifyJwt(newAccessToken);
        event.locals.user = { id: payload.sub, role: payload.role };
        event.locals.accessToken = newAccessToken;
      } catch (err) {
        console.log('hooks refresh token error:', err);
        // refresh 실패 → 로그아웃 처리
        event.cookies.delete(ACCESS_COOKIE, { path: '/' });
        event.cookies.delete(REFRESH_COOKIE, { path: '/' });
      }
    }
  }

  /* ===============================
   * 4. 요청 계속 진행
   * =============================== */
  return resolve(event);
};
