// src/routes/(app)/profile/[nickname]/profile.api.ts
import { get } from 'svelte/store';
import { auth, user } from '$lib/stores';
import { apiFetch } from '$lib/client/apiFetch';
import type { UserProfile } from '$lib/types/profile';
import type { CalendarEvent } from '$lib/types/calendar';

export async function loadProfile(
  nickname: string
): Promise<{ profile: UserProfile; isMyProfile: boolean }> {
  const me = get(user);
  const isMyProfile = me?.nickname === nickname;

  const endpoint = isMyProfile
    ? '/api/me/profile'
    : `/api/users/${nickname}/profile`;

  const token = isMyProfile ? get(auth)?.accessToken : undefined;

  const res = await apiFetch(endpoint, { accessToken: token });
  if (!res.ok) throw new Error('프로필 조회 실패');

  return {
    profile: await res.json(),
    isMyProfile
  };
}

export async function fetchIsFollowing(nickname: string) {
  const token = get(auth)?.accessToken;
  if (!token) return null;

  const res = await apiFetch(`/api/me/follows/${nickname}`, {
    accessToken: token
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data.is_following as boolean;
}

export async function loadCalendar(
  nickname: string,
  year: number,
  month: number
): Promise<CalendarEvent[]> {
  const isMine = get(user)?.nickname === nickname;

  const endpoint = isMine
    ? `/api/me/calendar`
    : `/api/users/${nickname}/calendar`;

  const token = isMine ? get(auth)?.accessToken : undefined;

  const res = await apiFetch(
    `${endpoint}?year=${year}&month=${month}`,
    { accessToken: token }
  );

  if (!res.ok) return [];
  return await res.json();
}

export async function loadFeed(nickname: string) {
  const res = await fetch(`/api/users/${nickname}/feeds`);
  if (!res.ok) return [];
  return await res.json();
}
