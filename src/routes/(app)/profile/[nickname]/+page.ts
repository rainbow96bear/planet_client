import type { PageLoad } from './$types';
import {
  loadProfile,
  loadCalendar,
  loadFeed,
  fetchIsFollowing
} from './page.api';

export const load: PageLoad = async ({ params, parent }) => {
  const { nickname } = params;
  const { profile: me, isLoggedIn } = await parent();

  const isMyProfile = isLoggedIn && me?.nickname === nickname;

  const profile = await loadProfile(nickname, isMyProfile);

  const isFollowing = !isMyProfile
    ? await fetchIsFollowing(nickname)
    : null;

  const today = new Date();

  const calendarEvents = await loadCalendar(
    nickname,
    today.getFullYear(),
    today.getMonth() + 1
  );

  return {
    nickname,
    profile,
    isMyProfile,
    isFollowing,
    calendarEvents
  };
};
