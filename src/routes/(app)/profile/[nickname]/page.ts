import { get } from 'svelte/store';
import { auth } from '$lib/stores/auth';
import type { UserProfile } from '$lib/types/profile';
import type { CalendarData } from '$lib/types/calendar';

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

export async function loadProfile(nickname: string): Promise<UserProfile | null> {
  try {
    const res = await fetch(`/api/users/${nickname}/profile`);
    if (!res.ok) throw new Error('프로필 조회 실패');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

// fetchIsFollowing 함수는 이미 headers를 명시적으로 전달하고 있으므로 오류가 나지 않습니다.
export async function fetchIsFollowing(nickname: string): Promise<boolean | null> {
  const token = get(auth)?.access_token;
  if (!token) return null;
  try {
    const res = await fetch(`/api/me/follows/${nickname}`, {
      // 🌟 개선 포인트: headers를 항상 객체로 전달하여 undefined 문제를 회피
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('팔로잉 여부 조회 실패');
    const data = await res.json();
    return data.is_following;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// 🌟 에러가 발생한 loadCalendar 함수 수정
export async function loadCalendar(nickname: string, currentYear: number, currentMonth: number): Promise<CalendarData> {
  try {
    const token = get(auth)?.access_token;
    const isMine = token && get(auth)?.nickname === nickname;
    let url = isMine ? `/api/me/calendar` : `/api/users/${nickname}/calendar`;
    url += `?year=${currentYear}&month=${currentMonth}`;

    // 🌟 수정된 부분: HeadersInit 타입으로 명시적으로 선언하고, token이 있을 때만 Authorization을 포함합니다.
    // 'new Headers()' 객체를 사용하거나, 조건부로 객체를 명확하게 구성하면 TypeScript 오류가 사라집니다.
    const headers: HeadersInit = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, { headers }); // 이제 headers 타입 오류 없음
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

export async function loadFeed(nickname: string): Promise<any[]> {
  try {
    // 🌟 개선 포인트: headers 객체를 항상 정의하여 fetch에 전달합니다. (여기서는 필요 없지만 일관성 유지)
    const res = await fetch(`/api/users/${nickname}/feeds`, { headers: {} });
    if (!res.ok) throw new Error('피드 조회 실패');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}