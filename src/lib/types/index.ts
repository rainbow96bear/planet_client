export interface Todo {
  text: string;
  completed: boolean;
}

export interface User {
  name: string;
  handle: string;
  avatar: string;
}

export interface Feed {
  id: number;
  user: User;
  date: string;
  title: string;
  todos: Todo[];
  image: boolean;
  emoji: string;
  visibility: 'public' | 'friends' | 'private';
  likes: number;
  comments: number;
  isLiked: boolean;
}