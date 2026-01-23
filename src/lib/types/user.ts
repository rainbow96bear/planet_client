// src/lib/types/user.ts
export type Theme = 'light' | 'dark';

export type User = {
  id: string | null;
  nickname: string | null;
  profileImage?: string;
  bio: string;
  theme: Theme;
};
