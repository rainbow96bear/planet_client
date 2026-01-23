// src/lib/components/profile/UserProfileHeader/UserProfileHeader.logic.ts
import type { ActionType } from './UserProfileHeader.types';

export function getActionButtons(params: {
  isMyProfile: boolean;
  isLoggedIn: boolean;
  isFollowing: boolean | null;
}) {
  const { isMyProfile, isLoggedIn, isFollowing } = params;

  if (isMyProfile) {
    return [
      { type: 'add-calendar', label: '일정 추가', variant: 'primary' },
      { type: 'add-feed', label: '피드 작성', variant: 'primary' },
      { type: 'settings', label: '설정', variant: 'secondary' }
    ] as const;
  }

  if (!isLoggedIn) {
    return [
      { type: 'login', label: '팔로우', variant: 'primary' }
    ] as const;
  }

  return [
    {
      type: isFollowing ? 'unfollow' : 'follow',
      label: isFollowing ? '언팔로우' : '팔로우',
      variant: isFollowing ? 'outline' : 'primary'
    }
  ] as const;
}
