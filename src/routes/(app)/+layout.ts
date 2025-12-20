// 파일: src/routes/+layout.ts (수정됨)

import type { LayoutLoad } from './$types';
import { auth ,user} from '$lib/stores';

// 유효한 테마 타입 정의
type ThemeType = 'light' | 'dark';

export const load: LayoutLoad = async ({ data }) => {
    // 1. 서버에서 전달된 data 객체를 통해 로그인 상태 확인
    if (data.isLoggedIn && data.profile) {
        
        // --- Type 'string' is not assignable to type '"light" | "dark"' 오류 방지 ---
        const incomingTheme = data.profile.theme;
        const validThemes: ThemeType[] = ['light', 'dark'];
        const resolvedTheme: ThemeType = (validThemes.includes(incomingTheme as ThemeType)) 
            ? incomingTheme as ThemeType 
            : 'light'; // 유효하지 않으면 'light' 기본값 할당
        // 2. User Store 업데이트
        user.set({
            id: data.profile.id,
            nickname: data.profile.nickname,
            profileImage: data.profile.profileImage,
            bio: data.profile.bio ?? '', // bio가 null일 수 있으므로 기본값 설정
            theme: resolvedTheme,
        });

        // 3. Auth Store 업데이트 (Access Token 복구)
        auth.update(a => ({
            ...a,
            accessToken: data.accessToken, // 서버에서 재발급받은 AT를 Store에 저장하여 복구
            userId: data.profile.id,
            expiresAt: data.expiresAt, // AT 만료 시각 저장
            isLoggedIn: true
        }));

    } else {
        // 4. 비로그인 상태일 때 Store 초기화
        auth.set({ accessToken: undefined, userId: null, expiresAt: null});
        user.set({ id: null, nickname: null, profileImage: undefined, bio: "", theme: 'light'});
    }

    // 서버 데이터를 반환
    return data;
};