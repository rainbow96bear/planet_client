// 파일 경로: $lib/utils/authFetch.ts (신규)

import { get } from 'svelte/store';
import { auth } from '$lib/stores/auth'; // 클라이언트 스토어 임포트

export async function authFetch(
    input: RequestInfo | URL, 
    init?: RequestInit
): Promise<Response> {
    const token = get(auth)?.access_token;
    
    // 기존 헤더 병합
    const headers = new Headers(init?.headers);

    if (token) {
        // Access Token이 있다면 Authorization 헤더를 추가합니다.
        headers.set('Authorization', `Bearer ${token}`);
    } 

    const newInit: RequestInit = {
        ...init,
        headers: headers,
    };

    // 브라우저 기본 fetch 사용
    return fetch(input, newInit); 
}