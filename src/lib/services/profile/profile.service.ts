// src/lib/services/profile/profile.service.ts
import { get } from 'svelte/store';
import { auth } from '$lib/stores';
import { apiFetch } from '$lib/client/apiFetch';
import type { UserProfile } from '$lib/types/profile';

export async function loadProfile(
  nickname: string,
  isMyProfile: boolean
): Promise<UserProfile | null> {
  const endpoint = isMyProfile
    ? '/api/me/profile'
    : `/api/users/${nickname}/profile`;

  try {
    const token = isMyProfile ? get(auth)?.accessToken : undefined;
    const res = await apiFetch(endpoint, { accessToken: token });
    if (!res.ok) throw new Error('프로필 조회 실패');
    return await res.json();
  } catch (err) {
    console.error('[loadProfile]', err);
    return null;
  }
}
