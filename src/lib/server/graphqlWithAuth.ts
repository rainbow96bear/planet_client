// 파일: src/lib/server/graphqlWithAuth.ts
import { graphqlRequest } from "./graphqlClient";
import { tokenIsExpired } from "$lib/utils/jwt";

interface EventContext {
  cookies: any;
  locals: any;
}

/**
 * access token 갱신을 자동 처리하는 GraphQL 요청
 */
export async function graphqlWithAuth<T = any>(
  url: string,
  query: string,
  variables: Record<string, any> = {},
  event?: any
): Promise<T> {
  const authHeader = event.request.headers.get('Authorization');
  let token: string | null = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
      console.log("Token successfully extracted.");
  } else {
      console.log("Token extraction failed. Does it start with 'Bearer '?");
  }
  // 1) access token 만료 확인
  if (token && tokenIsExpired(token)) {
    const refreshToken = event?.cookies.get("refresh_token");

    if (refreshToken) {
      // 2) refresh token으로 access token 갱신
      const refreshData = await graphqlRequest(
        process.env.VITE_AUTH_SERVER_GRAPHQL!,
        `
          mutation RefreshAccessToken {
            refreshAccessToken {
              accessToken
              expiresAt
              newRefreshToken
              refreshExpiresAt
            }
          }
        `,
        {},
        { authToken: refreshToken } // refresh token을 Authorization 헤더로 전달
      );
      
      if (refreshData?.refreshAccessToken) {
        token = refreshData.refreshAccessToken.accessToken;
        event!.locals.accessToken = token;
        // refresh token rotation 처리
        if (refreshData.refreshAccessToken.newRefreshToken) {
          const newRefreshToken = refreshData.refreshAccessToken.newRefreshToken;
          const refreshExpiresAt = refreshData.refreshAccessToken.refreshExpiresAt;
          event!.cookies.set("refresh_token", newRefreshToken, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: refreshExpiresAt
              ? Math.floor((new Date(refreshExpiresAt).getTime() - Date.now()) / 1000)
              : undefined
          });
        }
      } else {
        // refresh token 만료 → 로그아웃 처리
        token = null;
      }
    } else {
      // refresh token 없음 → 로그아웃 처리
      token = null;
    }
  }

  // 3) access token이 있으면 Authorization 헤더로 요청
  const authToken = token ?? undefined;
  return graphqlRequest<T>(url, query, variables, { authToken });
}
