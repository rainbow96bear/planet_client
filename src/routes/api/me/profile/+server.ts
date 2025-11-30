// src/routes/api/me/profile/+server.ts

import { json } from "@sveltejs/kit"; // 👈 json 헬퍼 임포트 추가
import type { RequestHandler } from "@sveltejs/kit";
import type { UserProfile } from '$lib/types/profile'; 

// 외부 사용자 서버 API URL (VITE_ 접두사는 SvelteKit에서 process.env로 접근 가능)
const USER_SERVER_API_URL = process.env.VITE_USER_SERVER_API_URL;

// --- GET: 프로필 정보 조회 ---
export const GET: RequestHandler = async ({ request }) => {
    try {
        const token = request.headers.get("authorization");
        
        // 1. 외부 서버로 요청
        const res = await fetch(`${USER_SERVER_API_URL}/me/profile`, {
            method: "GET",
            // 인증 토큰 전달
            headers: token ? { 'Authorization': token } : {},
        });

        const data: UserProfile = await res.json();
        
        // 2. 응답 상태 코드와 데이터를 그대로 클라이언트에 반환 (json 헬퍼 사용)
        return json(data, { status: res.status });
        
    } catch (err) {
        console.error('GET /api/profile/me error:', err);
        // 3. 서버 내부 오류 발생 시 500 응답 반환
        return json({ error: '서버 내부 오류' }, { status: 500 });
    }
};

// --- PATCH: 프로필 정보 업데이트 ---
export const PATCH: RequestHandler = async ({ request }) => {
    try {
        // 1. 요청 본문(Body) 및 인증 헤더 추출
        const requestBody = await request.json();
        const authHeader = request.headers.get('Authorization');

        // 2. 인증 헤더 누락 시 401 오류 반환 (요청 차단)
        if (!authHeader) {
            return json({ error: 'Authorization header missing' }, { status: 401 });
        }
        
        // 3. 외부 서버로 요청을 보낼 때, 헤더와 본문을 모두 전달합니다.
        const res = await fetch(`${USER_SERVER_API_URL}/me/profile`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                // 클라이언트에서 받은 Authorization 헤더를 그대로 전달
                'Authorization': authHeader
            },
            // 클라이언트에서 받은 본문 데이터를 문자열로 변환하여 전달
            body: JSON.stringify(requestBody),
        });
        
        // 4. 외부 서버 응답이 오류일 경우 처리
        if (!res.ok) {
            // 오류 응답 본문을 복사하여 클라이언트에게 정확한 오류 메시지를 전달
            const errorBody = await res.json();
            return json(errorBody, { status: res.status });
        }

        // 5. 성공 응답 처리
        const data = await res.json();
        
        // 성공 시 데이터와 함께 200 OK를 반환합니다.
        return json(data, { status: res.status });

    } catch (err) {
        console.error('PATCH /api/profile/me error:', err);
        // 6. 서버 내부 오류 발생 시 500 응답 반환
        return json({ error: '서버 내부 오류' }, { status: 500 });
    }
};