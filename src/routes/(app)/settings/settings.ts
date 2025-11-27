import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { theme, auth, isLoggedIn, clearAuth, initAuth, userProfile } from '$lib/stores';
import { authFetch } from '$lib/utils/authFetch';

// --- 프로필 불러오기 (fetchUserProfile) ---
export async function fetchUserProfile() {
    if (!get(auth)?.access_token) return;

    try {
        const res = await authFetch('/api/me/profile');

        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                clearAuth();
                goto('/auth/login');
                throw new Error('인증 만료');
            }
            throw new Error(`프로필 불러오기 실패: ${res.status}`);
        }

        const data = await res.json();
        userProfile.set(data);
    } catch (err) {
        console.error(err);
        userProfile.set(null);
    }
}

// --- 테마 변경 (handleThemeChange) ---
export async function handleThemeChange(event: CustomEvent<string>) { 
    const newTheme = event.detail as 'light' | 'dark'; 
    
    // UI에 즉시 반영
    theme.setTheme(newTheme);

    const token = get(auth)?.access_token;
    if (!token) return;

    try {
        await authFetch('/api/me/theme', {
            method: 'PATCH',
            body: JSON.stringify({ theme: newTheme })
        });
    } catch (err) {
        console.error('테마 저장 실패:', err);
    }
}

// --- 로그아웃 (handleLogout) ---
export async function handleLogout() {
    // 쿠키 기반 로그아웃을 위해 브라우저의 기본 fetch를 사용하고 credentials: 'include'를 명시합니다.
    try {
        await fetch('/api/auth/logout', { 
            method: 'POST',
            credentials: 'include', // ✅ 핵심: 이 옵션이 쿠키 전송을 보장하고, 서버의 Set-Cookie 응답을 받습니다.
        });

        // 서버의 응답 상태와 상관없이 클라이언트의 상태(Store)를 정리합니다.
        clearAuth();
        userProfile.set(null);
        goto('/'); // 원하는 이동 경로로 수정

    } catch (err) {
        console.error('로그아웃 통신 실패:', err);
        
        // 통신이 실패했더라도 로컬 상태는 정리하여 세션이 끊긴 것처럼 보이게 합니다.
        clearAuth(); 
        userProfile.set(null);
        goto('/'); 
    }
}

// --- 페이지 초기화 (initSettingsPage) ---
export async function initSettingsPage() {
    await initAuth();

    if (!get(isLoggedIn)) {
        return false;
    }

    await fetchUserProfile();

    if (!get(userProfile)) {
        clearAuth();
        return false;
    }

    return true;
}

//
// 🌟 닉네임 사용 가능 여부 검사 (manual check button에서 호출) 🌟
//
export async function checkNicknameAvailability(nickname: string): Promise<any> {
    // 1. 클라이언트 측 유효성 검사: 현재 사용 중인 닉네임과 같은지 확인
    if (get(userProfile)?.nickname === nickname) {
        return { available: true, message: "현재 사용 중인 닉네임입니다." };
    }
    
    const token = get(auth)?.access_token;
    if (!token) {
        return { available: false, reason: "unauthorized", message: "로그인이 필요합니다." };
    }
    if (!nickname.trim()) {
        return { available: false, reason: "invalid_input", message: "닉네임을 입력해주세요." };
    }


    try {
        // 서버 측 검사 요청
        const res = await authFetch(`/api/account/availability?field=nickname&value=${encodeURIComponent(nickname)}`);
        
        // 응답 JSON 본문 추출
        const data = await res.json();
        
        if (!res.ok) {
            // 4xx, 5xx 에러 처리: 서버에서 보낸 상세 에러 메시지를 반환
            console.error('닉네임 검사 API 오류:', res.status, data.error || data.message);
            // 서버 응답에 available: false와 상세 메시지가 포함되어 있다고 가정하고 반환
            return data;
        }

        // 200 OK 성공 응답 (서버는 { available: true/false, message: '...' }를 반환할 것으로 가정)
        return data; 

    } catch (err) {
        console.error('닉네임 검사 통신 실패:', err);
        return { available: false, reason: "network_error", message: "네트워크 오류로 검사에 실패했습니다." };
    }
}

//
// 🌟 프로필 정보 업데이트 함수 (updateProfile) 🌟
//
export async function updateProfile(
    nickname: string, 
    bio: string, 
    profileImage?: string 
): Promise<boolean> {
    const token = get(auth)?.access_token;
    if (!token) return false;

    try {
        const body = {
            nickname: nickname,
            bio: bio,
            // profileImage 값이 있다면 추가
            ...(profileImage !== undefined && { profile_image: profileImage }),
        };

        const res = await authFetch('/api/me/profile', {
            method: 'PATCH',
            body: JSON.stringify(body)
        });

        if (res.ok) {
            const updatedData = await res.json();
            // Store 업데이트: UI에 즉시 반영
            userProfile.update(current => ({
                ...current!,
                nickname: updatedData.nickname,
                bio: updatedData.bio,
                profile_image: updatedData.profile_image,
            }));
            return true;
        } else {
            const error = await res.json();
            console.error('프로필 업데이트 실패:', error);
            // 🚨 경쟁 조건 실패 시 (409 Conflict 등) 서버 오류 메시지를 alert으로 표시
            alert(`업데이트 실패: ${error.detail || error.error || '서버 오류'}`);
            return false;
        }
    } catch (err) {
        console.error('프로필 업데이트 통신 실패:', err);
        alert('네트워크 오류로 업데이트에 실패했습니다.');
        return false;
    }
}