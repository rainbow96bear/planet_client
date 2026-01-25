// lib/stores/feed/feed.types.ts

/**
 * 피드 필터 타입
 */
export type FeedFilter = 'all' | 'popular' | 'following';

/**
 * 피드 아이템
 */
export interface FeedItem {
  id: number;
  user: FeedUser;
  title: string;
  emoji: string;
  todos: FeedTodo[];
  date: string;
  image?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

/**
 * 피드 사용자 정보
 */
export interface FeedUser {
  name: string;
  handle: string;
  avatar: string;
}

/**
 * 피드 할일
 */
export interface FeedTodo {
  text: string;
  completed: boolean;
}

/**
 * 피드 스토어 상태
 */
export interface FeedStoreState {
  feeds: FeedItem[];
  selectedFilter: FeedFilter;
  loading: boolean;
  error: string | null;
}