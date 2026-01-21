// src/lib/stores/feed/feed.types.ts

export type FeedFilter = 'all' | 'popular' | 'following';

export type RawFeedTodo =
  | string
  | {
      text: string;
      completed: boolean;
    };

export type FeedTodo = {
  text: string;
  completed: boolean;
};

export type FeedUser = {
  name: string;
  handle: string;
  avatar: string;
};

export type FeedItem = {
  id: number;
  title: string;
  emoji: string;
  date: string;
  todos: RawFeedTodo[];
  user?: FeedUser;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  image?: boolean;
};
