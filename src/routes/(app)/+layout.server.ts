// 파일: src/routes/+layout.server.ts (GraphQL 직접 요청으로 개선)

import type { LayoutServerLoad } from './$types';
import { error } from '@sveltejs/kit';
// 💡 GraphQL 관련 모듈을 직접 가져옵니다.
import { graphqlRequest } from '$lib/server/graphqlClient';
import { ISSUE_ACCESS_TOKEN } from '$lib/graphql'; 
import { env } from '$env/dynamic/private'; // 환경 변수 접근을 위해 추가

// --- 상수 정의 ---
const AT_EXPIRES_KEY = process.env.VITE_AT_EXPIRES_KEY || 'at_expires_at';
const REFRESH_TOKEN = process.env.VITE_REFRESH_TOKEN_NAME!
const AUTH_SERVER_GRAPHQL = env.VITE_AUTH_SERVER_GRAPHQL; // GraphQL 서버 주소

// --- 타입 정의 ---
interface UserProfile {
    id: string; nickname: string; profileImage?: string; bio?: string; theme: 'light' | 'dark' | string; 
}

// 💡 ISSUE_ACCESS_TOKEN GraphQL 응답 타입 정의
interface AccessTokenResponse { 
    issueAccessToken: { 
        accessToken: string; 
        expiresAt: string; // ISO 8601 문자열
    }; 
}


export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
    
    const refreshToken = cookies.get(REFRESH_TOKEN); 
    
    // 1. Refresh Token이 없으면 비로그인 상태 반환
    if (!refreshToken) {
        cookies.delete(AT_EXPIRES_KEY, { path: '/' });
        return { isLoggedIn: false };
    }
    
    let accessToken: string;
    let expiresAt: number;
    let profile: UserProfile;

    try {
        // --- Access Token 갱신 로직 (GraphQL 직접 요청) ---
        // 1. GraphQL을 사용하여 RT를 전송하고 새 AT를 요청
        const data = await graphqlRequest<AccessTokenResponse>(
            AUTH_SERVER_GRAPHQL,
            ISSUE_ACCESS_TOKEN,
            { refreshToken }, // RT를 GraphQL 변수로 전달
        );
        if (!data || !data.issueAccessToken) {
            throw new Error("GraphQL response missing issueAccessToken data.");
        }
        
        const { accessToken: newAccessToken, expiresAt: expiresHeader } = 
            data.issueAccessToken;

        // 2. 토큰 및 만료 시각 추출
        accessToken = newAccessToken;
        // ISO 8601 문자열을 밀리초 단위 Timestamp로 변환
        expiresAt = new Date(expiresHeader).getTime();
        
        // 3. AT 만료 시각을 클라이언트가 읽을 수 있는 쿠키에 저장
        cookies.set(AT_EXPIRES_KEY, String(expiresAt), { path: '/' });


        // --- 사용자 프로필 요청 로직 ---
        
        // 4. 갱신된 AT로 프로필 요청 (여전히 HTTP fetch 사용)
        const profileResponse = await fetch('/api/me/profile', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        
        if (!profileResponse.ok) {
            throw new Error(`Failed to fetch profile: ${profileResponse.statusText}`);
        }
        profile = await profileResponse.json();
        
        // 5. 최종 반환
        return {
            isLoggedIn: true,
            accessToken, 
            expiresAt,
            profile 
        };

    } catch (e) {
        console.error('Authentication or Profile Fetch Failed:', e);
        // 실패 시 RT 및 AT 만료 시간 쿠키 삭제 (로그아웃 처리)
        cookies.delete(REFRESH_TOKEN, { path: '/' });
        cookies.delete(AT_EXPIRES_KEY, { path: '/' });
        
        return { isLoggedIn: false };
    }
};