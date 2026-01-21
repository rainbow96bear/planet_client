// src/lib/stores/feed/feed.store.ts
import { writable, derived } from 'svelte/store';
import type { Feed, FeedFilter } from './feed.types';
import { mockFeeds } from './feed.mock';

interface FeedState {
  feeds: Feed[];
  filter: FeedFilter;
  loading: boolean;
}

const initialState: FeedState = {
  feeds: [],
  filter: 'all',
  loading: false
};

const state = writable<FeedState>(initialState);

/* =====================
 * selectors (읽기 전용)
 * ===================== */
export const feeds = derived(state, s => s.feeds);
export const filter = derived(state, s => s.filter);
export const loading = derived(state, s => s.loading);

export const filteredFeeds = derived(state, ({ feeds, filter }) => {
  if (filter === 'popular') {
    return [...feeds].sort((a, b) => b.likes - a.likes);
  }
  if (filter === 'following') {
    return feeds.filter(f => f.user.handle !== '@minsu_dev');
  }
  return feeds;
});

/* =====================
 * actions (상태 변경)
 * ===================== */
function loadFeeds() {
  state.update(s => ({ ...s, loading: true }));

  setTimeout(() => {
    state.update(s => ({
      ...s,
      feeds: mockFeeds,
      loading: false
    }));
  }, 600);
}

function setFilter(next: FeedFilter) {
  state.update(s => ({ ...s, filter: next }));
}

function toggleLike(id: number) {
  state.update(s => ({
    ...s,
    feeds: s.feeds.map(f =>
      f.id === id
        ? {
            ...f,
            isLiked: !f.isLiked,
            likes: f.isLiked ? f.likes - 1 : f.likes + 1
          }
        : f
    )
  }));
}

function toggleBookmark(id: number) {
  state.update(s => ({
    ...s,
    feeds: s.feeds.map(f =>
      f.id === id
        ? { ...f, isBookmarked: !f.isBookmarked }
        : f
    )
  }));
}

export const feedStore = {
  loadFeeds,
  setFilter,
  toggleLike,
  toggleBookmark
};
