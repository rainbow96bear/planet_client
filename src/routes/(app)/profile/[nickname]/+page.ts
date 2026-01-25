// routes/(app)/profile/[nickname]/+page.ts
import { profileService } from '$lib/services/profile/profile.service';
import { get } from 'svelte/store';
import { user } from '$lib/stores';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
  const nickname = params.nickname;
  const currentUser = get(user);
  const isMyProfile = currentUser?.nickname === nickname;
  console.log("current User : ", currentUser?.nickname)
  console.log("nickname : ", nickname)
  // event.fetch를 전달
  await profileService.loadProfile(nickname, isMyProfile, fetch);

  const now = new Date();
  await profileService.loadCalendar(
    nickname,
    now.getFullYear(),
    now.getMonth() + 1,
    fetch  // event.fetch 전달
  );

  return {
    nickname,
    isMyProfile
  };
};