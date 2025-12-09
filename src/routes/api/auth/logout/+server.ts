// src/routes/api/user/logout/+server.ts
import type { RequestHandler } from '@sveltejs/kit';

const AUTH_SERVER_GRAPHQL = process.env.VITE_AUTH_SERVER_GRAPHQL;

export const POST: RequestHandler = async ({ request }) => {
    try {
        const authHeader = request.headers.get('authorization') ?? '';
        // 들어온 Cookie 헤더(브라우저가 보낸)를 그대로 읽음
        const cookieHeader = request.headers.get('cookie') ?? '';

        // 백엔드에 Cookie도 전달 -> Golang 기존 c.Cookie(...) 사용 가능
        const res = await fetch(`${AUTH_SERVER_GRAPHQL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Cookie': cookieHeader, // ✅ 쿠키 그대로 전달
            },
            redirect: 'manual'
        });

        // 백엔드 응답 헤더 (특히 set-cookie) 그대로 클라이언트로 전달
        const resText = await res.text();

        const newHeaders = new Headers();
        // backend에서 온 모든 헤더를 복사
        res.headers.forEach((value, key) => {
            // 브라우저로 전달할 때 set-cookie는 그대로 전달
            newHeaders.append(key, value);
        });

        // 응답 본문과 상태 그대로 반환
        return new Response(resText, {
            status: res.status,
            headers: newHeaders
        });
    } catch (err) {
        console.error('Logout proxy failed:', err);
        return new Response(JSON.stringify({ error: 'Logout proxy failed' }), { status: 500 });
    }
};