import { REFRESH_ACCESS_TOKEN } from "$lib/graphql";
import { graphqlRequest } from "$lib/server/graphqlClient";
import type { RequestHandler } from "@sveltejs/kit";

const REFRESH_COOKIE_NAME = process.env.VITE_REFRESH_TOKEN_NAME ?? "refresh_token";

export const POST: RequestHandler = async ({ request, cookies }) => {
	try {
		// 1. 쿠키에서 Refresh Token 읽기
		const refreshToken = cookies.get(REFRESH_COOKIE_NAME);

		// 2. Refresh Token 없으면 로그아웃 처리
		if (!refreshToken) {
			return new Response(
				JSON.stringify({ error: "Refresh token expired", logout: true }),
				{ status: 401, headers: { "Content-Type": "application/json" } }
			);
		}


		// 3. GraphQL로 refresh token 재발급 요청
		const data = await graphqlRequest(
			process.env.VITE_AUTH_SERVER_GRAPHQL!,
			REFRESH_ACCESS_TOKEN,
			{}
		);

		// 4. GraphQL 응답 검사
		if (!data || !data.refreshAccessToken) {
			return new Response(
				JSON.stringify({ error: "Token refresh failed", logout: true }),
				{ status: 401, headers: { "Content-Type": "application/json" } }
			);
		}

		const { accessToken, expiresAt, newRefreshToken, refreshExpiresAt } =
			data.refreshAccessToken;

		// 5. Refresh Token rotation 처리
		if (newRefreshToken) {
			cookies.set(REFRESH_COOKIE_NAME, newRefreshToken, {
				path: "/",
				httpOnly: true,
				secure: true,
				sameSite: "lax",
				maxAge: refreshExpiresAt ? Math.floor((new Date(refreshExpiresAt).getTime() - Date.now()) / 1000) : undefined
			});
		}

		// 6. Access Token을 헤더에 실어 프론트에게 전달
		const headers = new Headers();
		headers.set("Authorization", `Bearer ${accessToken}`);

		return new Response(null, {
			status: 200,
			headers
		});

	} catch (err) {
		console.error("Refresh token request error:", err);
		return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
	}
};
