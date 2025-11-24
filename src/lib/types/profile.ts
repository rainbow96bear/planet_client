export interface UserProfile {
  user_id: string;
  nickname: string;
  profile_image: string;
  bio?: string;
  email?: string;
  theme:string;
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
