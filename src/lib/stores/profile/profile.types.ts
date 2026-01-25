// lib/stores/profile/profile.types.ts

/**
 * 사용자 프로필 정보
 */
export interface Profile {
  user_id: string;
  nickname: string;
  profile_image: string;
  bio: string;
  email: string;
  theme: string;
  followerCount: number;
  followingCount: number;
}

/**
 * 캘린더 이벤트
 */
export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  description?: string;
  completed?: boolean;
}

/**
 * 프로필 스토어 상태
 */
export interface ProfileStoreState {
  profile: Profile | null;
  calendarEvents: CalendarEvent[];
  isFollowing: boolean | null;
  loading: boolean;
  error: string | null;
  viewerId: string | null; // 내 user_id
}