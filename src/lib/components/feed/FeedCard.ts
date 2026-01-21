// src/lib/components/feed/FeedCard.ts

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
  title: string;
  emoji: string;
  date: string;

  likes: number;
  comments: number;
  isLiked: boolean;

  image?: string;
  todos: Array<string | FeedTodo>;

  user?: FeedUser;
}
