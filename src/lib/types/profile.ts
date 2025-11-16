export type ProfileState = {
  profile: UserProfile | null;
  isAuthValid: boolean;
  isMyProfile: boolean;
  isFollowing: boolean | null;
  isLoadingProfile: boolean;
  isLoadingCalendar: boolean;
  isLoadingFeed: boolean;
};

export interface UserProfile {
  uuid: string;
  nickname: string;
  profile_image: string;
  bio?: string;
  email?: string;
  followerCount: number;
  followingCount: number;
}

export interface Feed {
  id: number;
  title: string;
  date: string;
  todos: { text: string; completed: boolean }[];
  likes: number;
  comments: number;
  emoji?: string;
  visibility: 'public' | 'friends' | 'private';
}
