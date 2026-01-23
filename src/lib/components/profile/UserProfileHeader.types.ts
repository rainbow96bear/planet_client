// src/lib/components/profile/UserProfileHeader/UserProfileHeader.types.ts
export interface UserProfileHeaderProfile {
  id: string;
  nickname: string;
  bio?: string;
  profileImage?: string;
  followerCount?: number;
  followingCount?: number;
}

export type ActionType =
  | 'add-calendar'
  | 'add-feed'
  | 'settings'
  | 'follow'
  | 'unfollow'
  | 'login';
