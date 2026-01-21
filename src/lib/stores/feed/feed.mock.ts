// src/lib/stores/feed/feed.mock.ts
import type { FeedItem } from './feed.types';

export const mockFeeds: FeedItem[] = [
  {
    id: 1,
    title: '오늘 할 일',
    emoji: '📌',
    date: '2026-01-21',
    todos: [
      'Svelte 공부',
      { text: '운동하기', completed: true },
      { text: '글 정리하기', completed: false }
    ],
    user: {
      name: '민수',
      handle: '@minsu_dev',
      avatar: '😄'
    },
    likes: 12,
    comments: 3,
    isLiked: false,
    isBookmarked: false,
    image: false
  },
  {
    id: 2,
    title: '주말 계획',
    emoji: '🗓️',
    date: '2026-01-20',
    todos: [
      '산책',
      '영화 보기'
    ],
    likes: 5,
    comments: 0,
    isLiked: true,
    isBookmarked: true
  }
];
