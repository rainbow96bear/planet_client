// Layout 관련 타입
export interface SuggestedUser {
  name: string;
  handle: string;
  avatar: string;
  bio: string;
}

export interface TrendingTag {
  tag: string;
  count: number;
}

export interface LayoutState {
  currentPath: string;
}

