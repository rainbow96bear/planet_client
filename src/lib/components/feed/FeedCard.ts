// FeedCard.ts
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
  id: string | number;
  title: string;
  emoji: string;
  date: string;
  todos: (string | FeedTodo)[];
  image?: boolean;
  likes: number;
  comments: number;
  isLiked: boolean;
  user?: FeedUser;
}
