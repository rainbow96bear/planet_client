// routes/(app)/profile/[nickname]/+page.ts
import type { PageLoad } from './$types';
import { get } from 'svelte/store';
import { user } from '$lib/stores';
import { profileService } from '$lib/services/profile/profile.service';

export const load: PageLoad = async ({ params, fetch }) => {
  const nickname = params.nickname;
  const currentUser = get(user);
  const isMyProfile = currentUser?.nickname === nickname;

  const now = new Date();

  /* ----------------------
   * 1️⃣ 프로필 조회
   * ---------------------- */
  const profileUrl = isMyProfile
    ? '/api/me/profile'
    : `/api/users/${nickname}/profile`;

  try {
    const res = await fetch(profileUrl);

    if (!res.ok) throw new Error('프로필 조회 실패');

    const profile = await res.json();
    profileService.applyProfile(profile);

    // 내 프로필이 아니면 팔로잉 여부 조회
    if (!isMyProfile) {
      const followRes = await fetch(`/api/me/follows/${nickname}`);

      if (followRes.ok) {
        const { is_following } = await followRes.json();
        profileService.applyIsFollowing(is_following);
      } else {
        profileService.applyIsFollowing(null);
      }
    }
  } catch (e) {
    console.error('[profile load]', e);
    profileService.clearProfile();
    profileService.applyIsFollowing(null);
  }

  /* ----------------------
   * 2️⃣ 캘린더 조회
   * ---------------------- */
  const calendarUrl = isMyProfile
    ? `/api/me/calendar`
    : `/api/users/${nickname}/calendar`;

  try {
    const res = await fetch(
      `${calendarUrl}?year=${now.getFullYear()}&month=${now.getMonth() + 1}`
    );

    if (!res.ok) throw new Error('캘린더 조회 실패');

    const events = await res.json();
    profileService.applyCalendar(events);
  } catch (e) {
    console.error('[calendar load]', e);
    profileService.applyCalendar([]);
  }

  return {
    nickname,
    isMyProfile
  };
};
