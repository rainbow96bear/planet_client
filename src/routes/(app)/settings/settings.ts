import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { auth, user, clearAuth } from '$lib/stores';
import { setTheme } from '$lib/stores/user';
import { fetchWithToken } from '$lib/client/fetchWithToken';

// ==========================================
// 🌟 프로필 불러오기 (fetchUserProfile)
// ==========================================
export async function fetchUserProfile() {
    const token = get(auth)?.accessToken;
    if (!token) return;

    try {
        const data = await fetchWithToken('/api/me/profile', token);

        user.set({
            id: data.id ?? null,
            nickname: data.nickname ?? null,
            profileImage: data.profileImage,
            bio: data.bio ?? "",
            theme: data.theme ?? 'light'
        });

    } catch (err: any) {
        console.error("프로필 불러오기 실패:", err);

        // 401 / 403 처리
        if (err?.message?.includes("status 401") || err?.message?.includes("status 403")) {
            clearAuth();
            goto('/auth/login');
        }

        user.set({
            id: null,
            nickname: null,
            profileImage: undefined,
            bio: "",
            theme: "light"
        });
    }
}

// ==========================================
// 🌟 테마 변경 (handleThemeChange)
// ==========================================
export async function handleThemeChange(event: CustomEvent<string>) {
    const newTheme = event.detail as 'light' | 'dark';

    // UI 즉시 반영
    setTheme(newTheme);
    const nickname = get(user).nickname
    const token = get(auth)?.accessToken;
    if (!token) return;

    try {
        await fetchWithToken('/api/me/theme', token, {
            method: 'PATCH',
            body: JSON.stringify({ nickname: nickname, theme: newTheme })
        });

    } catch (err) {
        console.error('테마 저장 실패:', err);
    }
}

// ==========================================
// 🌟 로그아웃 (handleLogout)
// ==========================================
export async function handleLogout() {
    try {
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

    } catch (err) {
        console.error("로그아웃 요청 실패:", err);
        // 실패해도 로컬 상태는 초기화해야 함.
    }

    clearAuth();
    user.set({
        id: null,
        nickname: null,
        profileImage: undefined,
        bio: "",
        theme: "light"
    });

    goto('/');
}

// ==========================================
// 🌟 닉네임 사용 가능 여부 검사
// ==========================================
export async function checkNicknameAvailability(nickname: string) {
    const profile = get(user);
    const token = get(auth)?.accessToken;

    if (profile?.nickname === nickname) {
        return { available: true, message: '현재 사용 중인 닉네임입니다.' };
    }

    if (!token) {
        return { available: false, reason: "unauthorized", message: "로그인이 필요합니다." };
    }

    if (!nickname.trim()) {
        return { available: false, reason: "invalid_input", message: "닉네임을 입력해주세요." };
    }

    try {
        const data = await fetchWithToken(
            `/api/account/availability?field=nickname&value=${encodeURIComponent(nickname)}`,
            token
        );

        return data;

    } catch (err) {
        console.error('닉네임 검사 통신 실패:', err);
        return { available: false, reason: "network_error", message: "네트워크 오류로 검사에 실패했습니다." };
    }
}

// ==========================================
// 🌟 프로필 업데이트 (updateProfile)
// ==========================================
export async function updateProfile(
    nickname: string,
    bio: string,
    profileImage?: string
): Promise<boolean> {
    const token = get(auth)?.accessToken;
    if (!token) return false;

    try {
        const body = {
            nickname,
            bio,
            ...(profileImage !== undefined && { profile_image: profileImage })
        };
        console.log("token : : : ",token)
        const data = await fetchWithToken('/api/me/profile', token, {
            method: 'PATCH',
            body: JSON.stringify(body)
        });

        // UI 업데이트
        user.update((curr) => ({
            ...curr,
            nickname: data.nickname,
            bio: data.bio,
            profileImage: data.profileImage
        }));

        return true;

    } catch (err: any) {
        console.error('프로필 업데이트 실패:', err);
        alert('네트워크 오류 또는 서버 오류로 업데이트에 실패했습니다.');
        return false;
    }
}
