import type { RequestHandler } from "@sveltejs/kit";
import { env } from '$env/dynamic/private';
import { graphqlRequest } from "$lib/server/graphqlClient";
import { ISSUE_ACCESS_TOKEN } from "$lib/graphql";


const AUTH_SERVER_GRAPHQL = env.VITE_AUTH_SERVER_GRAPHQL;
const REFRESH_COOKIE_NAME = env.REFRESH_TOKEN_COOKIE_NAME || "refreshToken";

export const POST: RequestHandler = async ({ cookies }) => {
  const refreshToken = cookies.get(REFRESH_COOKIE_NAME);

  if (!refreshToken) {
    return new Response(JSON.stringify({ message: "Refresh token not found." }), { status: 401 });
  }

  try {
    const data = await graphqlRequest<{ issueAccessToken: { accessToken: string; expiresAt: string } }>(
      AUTH_SERVER_GRAPHQL,
      ISSUE_ACCESS_TOKEN,
      { refreshToken }, // 변수로 refreshToken 전달
    );

    const { accessToken, expiresAt } = data.issueAccessToken;

    // 클라이언트에 access token 반환
    return new Response(null, {
      status: 200,
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "X-Expires-At": expiresAt
      }
    });

  } catch (err) {
    console.error('Failed to issue access token:', err);
    return new Response(JSON.stringify({ message: "Failed to issue access token." }), { status: 500 });
  }
};