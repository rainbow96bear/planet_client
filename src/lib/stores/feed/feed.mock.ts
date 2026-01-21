// src/lib/stores/feed/feed.mock.ts
import type { Feed } from './feed.types';

export const mockFeeds: Feed[] = [
  {
    id: 1,
    user: {
      name: '김민수',
      handle: '@minsu_dev',
      avatar: '👨‍💻'
    },
    date: '2시간 전',
    title: '오늘의 개발 기록',
    todos: [
      { text: '리팩토링', completed: true },
      { text: '테스트 코드 작성', completed: false }
    ],
    likes: 12,
    comments: 3,
    isLiked: false,
    isBookmarked: false
  }
];
