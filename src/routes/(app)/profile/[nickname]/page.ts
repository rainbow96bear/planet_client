import { user, auth } from '$lib/stores';
import type { UserProfile } from '$lib/types/profile';
import type { CalendarEvent } from '$lib/types/calendar';
import { get } from 'svelte/store';
import { apiFetch } from '$lib/client/apiFetch';

// ---------------------------
// 초기값 생성
// ---------------------------
export function createInitialState(nickname: string): UserProfile {
  return {
    user_id: "",
    nickname,
    profile_image: "",
    bio: "",
    email: "",
    theme: "",
    followerCount: 0,
    followingCount: 0
  };
}

// ---------------------------
// 프로필 조회
// ---------------------------
export async function loadProfile(
  nickname: string,
  isMyProfile: boolean
): Promise<UserProfile | null> {

  const endpoint = isMyProfile
    ? `/api/me/profile`
    : `/api/users/${nickname}/profile`;

  try {
    const token = isMyProfile ? get(auth)?.accessToken : undefined;

    const res = await apiFetch(endpoint, { accessToken: token });
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

// ---------------------------
// 팔로잉 여부 조회
// ---------------------------
export async function fetchIsFollowing(
  nickname: string
): Promise<boolean | null> {
  try {
    const token = get(auth)?.accessToken;

    const res = await apiFetch(`/api/me/follows/${nickname}`, {
      accessToken: token
    });

    if (res.status === 401 || res.status === 403) {
      return null; // 인증 실패 → 팔로우 여부 알 수 없음
    }

    if (!res.ok) throw new Error('팔로잉 여부 조회 실패');

    const data = await res.json();
    return data.is_following;
  } catch (err) {
    console.error(err);
    return null;
  }
}

// ---------------------------
// 캘린더 조회 (이벤트 배열만 반환)
// ---------------------------
export async function loadCalendar(
  nickname: string,
  currentYear: number,
  currentMonth: number
): Promise<CalendarEvent[]> {
  try {
    const isMine = get(user)?.nickname === nickname;

    let url = isMine
      ? `/api/me/calendar`
      : `/api/users/${nickname}/calendar`;

    url += `?year=${currentYear}&month=${currentMonth}`;
    const token = isMine ? get(auth)?.accessToken : undefined;

    const res = await apiFetch(url, { accessToken: token });

    if (!res.ok) throw new Error('캘린더 조회 실패');

    const data = await res.json();
    // 이제 이벤트 배열만 반환
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

// ---------------------------
// 공개 피드 조회 (토큰 필요 없음)
// ---------------------------
export async function loadFeed(
  nickname: string
): Promise<any[]> {
  try {
    const res = await fetch(`/api/users/${nickname}/feeds`);

    if (!res.ok) throw new Error('피드 조회 실패');

    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}
