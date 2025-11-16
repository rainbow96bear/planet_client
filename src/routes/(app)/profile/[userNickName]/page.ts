import { get } from 'svelte/store';
import { auth } from '$lib/stores/auth';
import type { ProfileState, UserProfile } from '$lib/types/profile';
import type { CalendarData } from '$lib/types/calendar';

export function createInitialState(userNickName: string): ProfileState {
  const now = new Date();
  return {
    profile: null,
    isAuthValid: false,
    isMyProfile: false,
    isFollowing: null,
    isLoadingProfile: true,
    isLoadingCalendar: false,
    isLoadingFeed: false,
  };
}

export async function loadProfile(userNickName: string): Promise<UserProfile | null> {
  try {
    const res = await fetch(`/api/profile/${userNickName}`);
    if (!res.ok) throw new Error('프로필 조회 실패');
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function fetchIsFollowing(userNickName: string): Promise<boolean | null> {
  const token = get(auth)?.access_token;
  if (!token) return null;
  try {
    const res = await fetch(`/api/profile/${userNickName}/follow-status`, {
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

export async function loadCalendar(userNickName: string, currentYear: number, currentMonth: number): Promise<CalendarData> {
  try {
    const token = get(auth)?.access_token;
    const isMine = token && get(auth)?.nickname === userNickName;
    let url = isMine ? `/api/calendar` : `/api/calendar/user/${userNickName}`;
    url += `?year=${currentYear}&month=${currentMonth}`;

    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(url, { headers });
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

export async function loadFeed(userNickName: string): Promise<any[]> {
  try {
    const res = await fetch(`/api/feeds/user/${userNickName}`);
    if (!res.ok) throw new Error('피드 조회 실패');
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}