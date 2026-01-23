export type Theme = 'light' | 'dark';

export interface UserProfile {
  id: number | null;
  nickname: string | null;
  profileImage?: string;
  bio: string;
  theme: Theme;
}
