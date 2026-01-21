// src/lib/stores/feed/feed.types.ts

export type FeedFilter = 'all' | 'following' | 'popular';

export interface FeedUser {
  name: string;
  handle: string;
  avatar: string;
}

export interface FeedTodo {
  text: string;
  completed: boolean;
}

export interface Feed {
  id: number;
  user: FeedUser;
  date: string;
  title: string;
  todos: FeedTodo[];
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
}
