// $lib/stores/feed.ts

import { writable, derived, get } from 'svelte/store';

// -----------------------------
// Types
// -----------------------------
export type FeedFilter = 'all' | 'following' | 'popular';
export type FeedVisibility = 'public' | 'friends' | 'private';

export interface TodoItem {
  text: string;
  completed: boolean;
}

export interface FeedUser {
  name: string;
  handle: string;
  avatar: string;
}

export interface Feed {
  id: number;
  user: FeedUser;
  date: string;
  title: string;
  todos: TodoItem[];
  image: boolean;
  emoji: string;
  visibility: FeedVisibility;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked?: boolean;
}

interface FeedState {
  feeds: Feed[];
  selectedFilter: FeedFilter;
  isLoading: boolean;
  error: string | null;
}

// -----------------------------
// Initial State
// -----------------------------
const initialState: FeedState = {
  feeds: [],
  selectedFilter: 'all',
  isLoading: false,
  error: null
};

// -----------------------------
// Store
// -----------------------------
const feedState = writable<FeedState>(initialState);

// -----------------------------
// Derived Stores
// -----------------------------
export const feeds = derived(feedState, ($state) => $state.feeds);
export const selectedFilter = derived(feedState, ($state) => $state.selectedFilter);
export const isLoading = derived(feedState, ($state) => $state.isLoading);
export const error = derived(feedState, ($state) => $state.error);

// 필터링된 피드
export const filteredFeeds = derived(
  [feedState],
  ([$state]) => {
    const { feeds, selectedFilter } = $state;
    
    switch (selectedFilter) {
      case 'following':
        // TODO: 실제로는 팔로잉 사용자의 피드만 필터링
        return feeds.filter(feed => feed.user.handle !== '@minsu_dev');
      case 'popular':
        // 좋아요 수로 정렬
        return [...feeds].sort((a, b) => b.likes - a.likes);
      case 'all':
      default:
        return feeds;
    }
  }
);

// 통계 정보
export const feedStats = derived(
  [feedState],
  ([$state]) => {
    const totalFeeds = $state.feeds.length;
    const totalLikes = $state.feeds.reduce((sum, feed) => sum + feed.likes, 0);
    const totalComments = $state.feeds.reduce((sum, feed) => sum + feed.comments, 0);
    const likedFeeds = $state.feeds.filter(feed => feed.isLiked).length;

    return {
      totalFeeds,
      totalLikes,
      totalComments,
      likedFeeds
    };
  }
);

// -----------------------------
// Mock Data
// -----------------------------
const mockFeeds: Feed[] = [
  {
    id: 1,
    user: { name: '김민수', handle: '@minsu_dev', avatar: '👨‍💻' },
    date: '2시간 전',
    title: '오늘의 개발 목표 달성! 🎉',
    todos: [
      { text: 'React 컴포넌트 리팩토링', completed: true },
      { text: 'API 문서 작성', completed: true },
      { text: '코드 리뷰 3건 완료', completed: true }
    ],
    image: true,
    emoji: '💻',
    visibility: 'public',
    likes: 42,
    comments: 8,
    isLiked: false,
    isBookmarked: false
  },
  {
    id: 2,
    user: { name: '박지은', handle: '@jieun_fit', avatar: '🏃‍♀️' },
    date: '5시간 전',
    title: '오늘의 운동 루틴',
    todos: [
      { text: '아침 러닝 5km', completed: true },
      { text: '플랭크 3분', completed: true },
      { text: '스쿼트 50개', completed: false }
    ],
    image: true,
    emoji: '💪',
    visibility: 'public',
    likes: 128,
    comments: 15,
    isLiked: true,
    isBookmarked: true
  },
  {
    id: 3,
    user: { name: '이준호', handle: '@junho_reader', avatar: '📚' },
    date: '8시간 전',
    title: '이번 주 독서 계획',
    todos: [
      { text: '클린 코드 3장 읽기', completed: true },
      { text: '독서 노트 정리', completed: true },
      { text: '서평 작성하기', completed: true }
    ],
    image: false,
    emoji: '📖',
    visibility: 'friends',
    likes: 34,
    comments: 5,
    isLiked: false,
    isBookmarked: false
  },
  {
    id: 4,
    user: { name: '최수현', handle: '@suhyun_cook', avatar: '👩‍🍳' },
    date: '12시간 전',
    title: '새로운 레시피 도전',
    todos: [
      { text: '재료 준비하기', completed: true },
      { text: '파스타 소스 만들기', completed: true },
      { text: '플레이팅 연습', completed: false }
    ],
    image: true,
    emoji: '🍝',
    visibility: 'public',
    likes: 89,
    comments: 23,
    isLiked: false,
    isBookmarked: false
  }
];

// -----------------------------
// Actions
// -----------------------------

/**
 * 피드 목록 로드
 * @param customFetch - SSR에서 사용할 fetch 함수
 */
async function loadFeeds(customFetch?: typeof fetch) {
  const myFetch = customFetch ?? fetch;
  
  feedState.update(state => ({ ...state, isLoading: true, error: null }));

  try {
    // 실제 API 사용 시:
    // const res = await myFetch('/api/feeds', { 
    //   credentials: 'include',
    //   headers: { 'Content-Type': 'application/json' }
    // });
    // if (!res.ok) {
    //   throw new Error(`Failed to load feeds: ${res.status}`);
    // }
    // const data: Feed[] = await res.json();

    // 임시: 네트워크 지연 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 800));
    
    feedState.update(state => ({
      ...state,
      feeds: mockFeeds,
      isLoading: false
    }));
  } catch (err) {
    console.error('Load feeds error:', err);
    feedState.update(state => ({
      ...state,
      isLoading: false,
      error: err instanceof Error ? err.message : 'Failed to load feeds'
    }));
  }
}

/**
 * 필터 변경
 */
function setFilter(filter: FeedFilter) {
  feedState.update(state => ({ ...state, selectedFilter: filter }));
}

/**
 * 좋아요 토글 (낙관적 업데이트)
 */
async function toggleLike(feedId: number) {
  const currentState = get(feedState);
  const feed = currentState.feeds.find(f => f.id === feedId);
  
  if (!feed) {
    console.warn(`Feed ${feedId} not found`);
    return;
  }

  const previousIsLiked = feed.isLiked;
  const previousLikes = feed.likes;

  // 낙관적 업데이트
  feedState.update(state => ({
    ...state,
    feeds: state.feeds.map(f => 
      f.id === feedId 
        ? { 
            ...f, 
            isLiked: !f.isLiked,
            likes: f.isLiked ? f.likes - 1 : f.likes + 1
          }
        : f
    )
  }));

  try {
    // 실제 API 호출
    // const res = await fetch(`/api/feeds/${feedId}/like`, {
    //   method: previousIsLiked ? 'DELETE' : 'POST',
    //   credentials: 'include',
    //   headers: { 'Content-Type': 'application/json' }
    // });
    // if (!res.ok) {
    //   throw new Error(`Failed to toggle like: ${res.status}`);
    // }
    
    // 임시: 성공 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 300));
  } catch (err) {
    // 실패 시 롤백
    console.error('Toggle like error:', err);
    feedState.update(state => ({
      ...state,
      feeds: state.feeds.map(f => 
        f.id === feedId 
          ? { 
              ...f, 
              isLiked: previousIsLiked,
              likes: previousLikes
            }
          : f
      )
    }));
  }
}

/**
 * 북마크 토글 (낙관적 업데이트)
 */
async function toggleBookmark(feedId: number) {
  const currentState = get(feedState);
  const feed = currentState.feeds.find(f => f.id === feedId);
  
  if (!feed) {
    console.warn(`Feed ${feedId} not found`);
    return;
  }

  const previousIsBookmarked = feed.isBookmarked;

  // 낙관적 업데이트
  feedState.update(state => ({
    ...state,
    feeds: state.feeds.map(f => 
      f.id === feedId 
        ? { ...f, isBookmarked: !f.isBookmarked }
        : f
    )
  }));

  try {
    // 실제 API 호출
    // const res = await fetch(`/api/feeds/${feedId}/bookmark`, {
    //   method: previousIsBookmarked ? 'DELETE' : 'POST',
    //   credentials: 'include',
    //   headers: { 'Content-Type': 'application/json' }
    // });
    // if (!res.ok) {
    //   throw new Error(`Failed to toggle bookmark: ${res.status}`);
    // }
    
    // 임시: 성공 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 300));
  } catch (err) {
    // 실패 시 롤백
    console.error('Toggle bookmark error:', err);
    feedState.update(state => ({
      ...state,
      feeds: state.feeds.map(f => 
        f.id === feedId 
          ? { ...f, isBookmarked: previousIsBookmarked }
          : f
      )
    }));
  }
}

/**
 * 댓글 수 증가
 */
function incrementCommentCount(feedId: number) {
  feedState.update(state => ({
    ...state,
    feeds: state.feeds.map(f => 
      f.id === feedId 
        ? { ...f, comments: f.comments + 1 }
        : f
    )
  }));
}

/**
 * 피드 삭제
 */
async function deleteFeed(feedId: number) {
  try {
    // 실제 API 호출
    // const res = await fetch(`/api/feeds/${feedId}`, {
    //   method: 'DELETE',
    //   credentials: 'include'
    // });
    // if (!res.ok) {
    //   throw new Error(`Failed to delete feed: ${res.status}`);
    // }

    feedState.update(state => ({
      ...state,
      feeds: state.feeds.filter(f => f.id !== feedId)
    }));
  } catch (err) {
    console.error('Delete feed error:', err);
    throw err;
  }
}

/**
 * 피드 추가 (새 게시물 작성)
 */
function addFeed(feed: Feed) {
  feedState.update(state => ({
    ...state,
    feeds: [feed, ...state.feeds]
  }));
}

/**
 * 피드 업데이트
 */
function updateFeed(feedId: number, updates: Partial<Feed>) {
  feedState.update(state => ({
    ...state,
    feeds: state.feeds.map(f => 
      f.id === feedId ? { ...f, ...updates } : f
    )
  }));
}

/**
 * 에러 클리어
 */
function clearError() {
  feedState.update(state => ({ ...state, error: null }));
}

/**
 * 스토어 초기화
 */
function reset() {
  feedState.set(initialState);
}

// -----------------------------
// Export
// -----------------------------
export const feedStore = {
  // Derived Stores
  feeds,
  selectedFilter,
  isLoading,
  error,
  filteredFeeds,
  feedStats,
  
  // Actions
  loadFeeds,
  setFilter,
  toggleLike,
  toggleBookmark,
  incrementCommentCount,
  deleteFeed,
  addFeed,
  updateFeed,
  clearError,
  reset
};