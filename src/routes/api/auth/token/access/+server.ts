// src/routes/api/auth/token/access/+server.ts

import type { RequestHandler } from '@sveltejs/kit';
import { graphqlRequest } from '$lib/server/graphqlClient';
import { ISSUE_ACCESS_TOKEN } from '$lib/graphql';

const AUTH_SERVER_GRAPHQL = process.env.VITE_AUTH_SERVER_GRAPHQL!;
const REFRESH_COOKIE_NAME = process.env.REFRESH_TOKEN_COOKIE_NAME || 'refreshToken';
const AT_EXPIRES_KEY = process.env.VITE_AT_EXPIRES_KEY || 'at_expires_at';

export const POST: RequestHandler = async ({ cookies }) => {
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
      AUTH_SERVER_GRAPHQL,
      ISSUE_ACCESS_TOKEN,
      { refreshToken }
    );

    const payload = data?.issueAccessToken;

    if (!payload?.accessToken || !payload.expiresAt) {
      throw new Error('Invalid issueAccessToken response');
    }

    return new Response(null, {
      status: 200,
      headers: {
        Authorization: `Bearer ${payload.accessToken}`,
        'X-Expires-At': payload.expiresAt
      }
    });
  } catch (err) {
    console.error('[POST /api/auth/token/access]', err);
    cookies.delete(REFRESH_COOKIE_NAME, { path: '/' });
    cookies.delete(AT_EXPIRES_KEY, { path: '/' });
    return new Response(null, { status: 401 });
  }
};