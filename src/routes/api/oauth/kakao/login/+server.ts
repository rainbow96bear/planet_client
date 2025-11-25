import type { RequestHandler } from '@sveltejs/kit';

const KAKAO_REST_API_KEY = process.env.VITE_KAKAO_REST_API_KEY;
const KAKAO_REDIRECT_URI = process.env.VITE_KAKAO_REDIRECT_URI;

export const GET: RequestHandler = async ({ fetch }) => {

    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}`
    return new Response(null, {
        status: 302,
        headers: { Location: kakaoAuthUrl }
    });
};
