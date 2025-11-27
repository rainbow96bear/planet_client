import { get } from 'svelte/store';
import { auth } from '$lib/stores/auth';
import type { UserProfile } from '$lib/types/profile';
import type { CalendarData } from '$lib/types/calendar';
import { authFetch } from '$lib/utils/authFetch';

// --- (createInitialState, loadProfile, loadFeed 함수는 변경 없음) ---

export function createInitialState(nickname: string): UserProfile {
  return {
    user_id: "",
    nickname: nickname,
    profile_image: "",
    bio: "",
    email: "",
    theme:"",
    followerCount: 0,
    followingCount: 0
  };
}

export async function loadProfile(nickname: string, isMyProfile: boolean): Promise<UserProfile | null> {
    
    // 본인 프로필일 경우 /api/me/profile, 아니면 /api/users/{nickname}/profile 사용
    const endpoint = isMyProfile 
        ? `/api/me/profile` 
        : `/api/users/${nickname}/profile`;
    
    try {
        // 🌟 authFetch 사용
        const res = await authFetch(endpoint); 
        
        if (!res.ok) {
            console.error(`프로필 조회 실패: ${res.status} ${res.statusText}`);
            throw new Error('프로필 조회 실패');
        }
        return await res.json();
    } catch (err) {
        console.error(`[loadProfile] 엔드포인트 ${endpoint} 실패:`, err);
        return null;
    }
}

// fetchIsFollowing 함수 (authFetch 사용으로 개선됨)
export async function fetchIsFollowing(nickname: string): Promise<boolean | null> {
    try {
        // 🌟 authFetch 사용
        const res = await authFetch(`/api/me/follows/${nickname}`);
        
        // 토큰이 없거나 만료되어 401 Unauthorized가 반환되면, 팔로우 여부를 알 수 없으므로 null 반환
        if (res.status === 401 || res.status === 403) {
            return null;
        }
        
        if (!res.ok) throw new Error('팔로잉 여부 조회 실패');
        
        const data = await res.json();
        return data.is_following;
    } catch (err) {
        console.error(err);
        return null;
    }
}

// 🌟 loadCalendar 함수 개선 (authFetch 사용)
export async function loadCalendar(nickname: string, currentYear: number, currentMonth: number): Promise<CalendarData> {
    try {
        const isMine = get(auth)?.nickname === nickname; // isMine 판단 로직 간소화
        let url = isMine ? `/api/me/calendar` : `/api/users/${nickname}/calendar`;
        url += `?year=${currentYear}&month=${currentMonth}`;

        // 🌟 authFetch는 토큰을 자동으로 추가하므로, 수동으로 토큰을 가져와 headers를 만들 필요가 없습니다.
        const res = await authFetch(url); 
        
        if (!res.ok) throw new Error('캘린더 조회 실패');

        const data = await res.json();
        return {
            events: data.events ?? [],
            monthData: data.monthData ?? [],
            completionData: data.completionData ?? {},
            year: currentYear,
            month: currentMonth
        };
    } catch (err) {
        console.error(err);
        return {
            events: [],
            monthData: [],
            completionData: {},
            year: currentYear,
            month: currentMonth
        };
    }
}

// loadFeed 함수 (인증이 필요 없는 경우이므로 기본 fetch 사용 유지)
export async function loadFeed(nickname: string): Promise<any[]> {
    try {
        // 🌟 기본 fetch 사용 유지 (공개 피드로 가정)
        const res = await fetch(`/api/users/${nickname}/feeds`, { headers: {} });
        if (!res.ok) throw new Error('피드 조회 실패');
        return await res.json();
    } catch (err) {
        console.error(err);
        return [];
    }
}