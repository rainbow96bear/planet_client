// +server.ts (OAuth Callback)
import { OAUTH_LOGIN } from '$lib/graphql';
import { graphqlRequest } from '$lib/server/graphqlClient';
import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, fetch, cookies }) => {
    const code = url.searchParams.get('code');
    if (!code) {
        return new Response(JSON.stringify({ error: 'Missing code' }), { status: 400 });
    }

    // 1) 카카오 토큰
    const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=utf-8" },
        body: new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.VITE_KAKAO_REST_API_KEY!,
            redirect_uri: process.env.VITE_KAKAO_REDIRECT_URI!,
            code,
            client_secret: process.env.VITE_KAKAO_CLIENT_SECRET!
        })
    });

    if (!tokenRes.ok) {
        return new Response(JSON.stringify({ error: 'Failed to get kakao token' }), { status: 500 });
    }

    const kakaoToken = await tokenRes.json();

    // 2) 카카오 사용자 정보
    const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
        headers: { Authorization: `Bearer ${kakaoToken.access_token}` }
    });

    if (!userRes.ok) {
        return new Response(JSON.stringify({ error: 'Failed to fetch user info' }), { status: 500 });
    }

    const user = await userRes.json();
    const kakaoId = user.id.toString();

    const variables = {
        input: {
            provider: "KAKAO",
            providerId: kakaoId
        }
    };

    const loginRes = await graphqlRequest(
        process.env.VITE_AUTH_SERVER_GRAPHQL!,
        OAUTH_LOGIN,
        variables
    );

    const data = loginRes.oauthLogin;

    // 회원가입 필요
    if (data.signupToken) {
        throw redirect(
            307,
            `/signup/oauth?token=${data.signupToken}&provider=kakao`
        );
    }

    const calcMaxAge = (exp: string) => {
        const diff = (new Date(exp).getTime() - Date.now()) / 1000;
        return diff > 0 ? Math.floor(diff) : 0;
    };

    cookies.set("refreshToken", data.refreshToken, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: calcMaxAge(data.refreshTokenExpiresAt)
    });

    // **여기서 Access Token을 store로 보내지 않음!**
    throw redirect(307, "/login/callback?status=success");
};
