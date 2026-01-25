// src/routes/api/auth/token/access/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { graphqlRequest } from '$lib/server/graphqlRequest';
import { ISSUE_ACCESS_TOKEN } from '$lib/graphql';

const AUTH_SERVER_GRAPHQL = process.env.VITE_AUTH_SERVER_GRAPHQL!;
const REFRESH_COOKIE_NAME = process.env.VITE_REFRESH_TOKEN_COOKIE_NAME || 'refreshToken';
const ACCESS_COOKIE_NAME = process.env.VITE_ACCESS_TOKEN_NAME || 'accessToken';

export const POST: RequestHandler = async (event) => {
  const { cookies } = event
  const refreshToken = cookies.get(REFRESH_COOKIE_NAME);

  if (!refreshToken) {
    return new Response(null, { status: 401 });
  }

  try {
    const data = await graphqlRequest<{
      issueAccessToken: {
        accessToken: string;
        expiresAt: string;
      };
    }>(
      event, 
      AUTH_SERVER_GRAPHQL, 
      ISSUE_ACCESS_TOKEN, 
      { refreshToken }
    );
    const { accessToken, expiresAt } = data.issueAccessToken;
    const expires = new Date(expiresAt);

    cookies.set(ACCESS_COOKIE_NAME, accessToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires
    });

    return new Response(null, { status: 204 });
  } catch (err) {
    console.log("api autn token access")
    // cookies.delete(REFRESH_COOKIE_NAME, { path: '/' });
    // cookies.delete(ACCESS_COOKIE_NAME, { path: '/' });
    return new Response(null, { status: 401 });
  }
};
