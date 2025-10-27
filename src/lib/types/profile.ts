export interface UserProfile {
  uuid: string;
  nickname: string;
  profile_image: string;
  bio?: string;
  email?: string;
  followerCount: number;
  followingCount: number;
}

export interface CalendarEvent {
  id: number;
  title: string;
  start: number;
  end: number;
  emoji?: string;
  visibility: 'public' | 'friends' | 'private';
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
