// +server.ts (Kakao OAuth Callback)
import { OAUTH_LOGIN } from '$lib/graphql';
import { graphqlRequest } from '$lib/server/graphqlRequest';
import { redirect, type RequestHandler } from '@sveltejs/kit';

const REFRESH_COOKIE_NAME =
  process.env.VITE_REFRESH_TOKEN_COOKIE_NAME || 'refreshToken';

export const GET: RequestHandler = async (event) => {
  const { url, fetch, cookies } = event;

  const code = url.searchParams.get('code');
  if (!code) {
    return new Response(JSON.stringify({ error: 'Missing code' }), { status: 400 });
  }

  /* ===============================
   * 1. 카카오 토큰 요청
   * =============================== */
  const tokenRes = await fetch('https://kauth.kakao.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.VITE_KAKAO_REST_API_KEY!,
      redirect_uri: process.env.VITE_KAKAO_REDIRECT_URI!,
      code,
      client_secret: process.env.VITE_KAKAO_CLIENT_SECRET!
    })
  });

  if (!tokenRes.ok) {
    return new Response(JSON.stringify({ error: 'Failed to get kakao token' }), {
      status: 500
    });
  }

  const kakaoToken = await tokenRes.json();

  /* ===============================
   * 2. 카카오 유저 정보
   * =============================== */
  const userRes = await fetch('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${kakaoToken.access_token}`
    }
  });

  if (!userRes.ok) {
    return new Response(JSON.stringify({ error: 'Failed to fetch user info' }), {
      status: 500
    });
  }

  const user = await userRes.json();
  const kakaoId = String(user.id);

  /* ===============================
   * 3. Auth 서버 OAuth 로그인
   * =============================== */
  const { oauthLogin } = await graphqlRequest<{
    oauthLogin: {
      refreshToken: string;
      refreshTokenExpiresAt: string;
      signupToken?: string;
    };
  }>(
    event,
    process.env.VITE_AUTH_SERVER_GRAPHQL!,
    OAUTH_LOGIN,
    {
      input: {
        provider: 'KAKAO',
        providerId: kakaoId
      }
    },
  );

  /* ===============================
   * 4. 회원가입 분기
   * =============================== */
  if (oauthLogin.signupToken) {
    throw redirect(
      307,
      `/signup/oauth?token=${oauthLogin.signupToken}&provider=kakao`
    );
  }

  /* ===============================
   * 5. refresh token 저장 (httpOnly)
   * =============================== */
  const maxAge =
    (new Date(oauthLogin.refreshTokenExpiresAt).getTime() - Date.now()) / 1000;

  cookies.set(REFRESH_COOKIE_NAME, oauthLogin.refreshToken, {
    path: '/',
    httpOnly: true, // ✅ 중요
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: Math.floor(Math.max(maxAge, 0))
  });

  /* ===============================
   * 6. 완료 → hooks가 access token 발급
   * =============================== */
  throw redirect(307, '/login/callback?status=success');
};
