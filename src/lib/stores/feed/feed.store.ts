import { writable, derived } from 'svelte/store';
import type { FeedFilter, FeedItem } from './feed.types';
import { mockFeeds } from './feed.mock';

const feeds = writable<FeedItem[]>([]);
const filter = writable<FeedFilter>('all');
const loading = writable(false);

const filteredFeeds = derived(
  [feeds, filter],
  ([$feeds, $filter]) => {
    if ($filter === 'popular') {
      return [...$feeds].sort((a, b) => b.likes - a.likes);
    }

    if ($filter === 'following') {
      return $feeds.filter(f => f.user?.handle !== '@minsu_dev');
    }

    return $feeds;
  }
);

function loadFeeds() {
  loading.set(true);
  setTimeout(() => {
    feeds.set(mockFeeds);
    loading.set(false);
  }, 600);
}

function setFilter(next: FeedFilter) {
  filter.set(next);
}

function toggleLike(id: number) {
  feeds.update(items =>
    items.map(f =>
      f.id === id
        ? {
            ...f,
            isLiked: !f.isLiked,
            likes: f.isLiked ? f.likes - 1 : f.likes + 1
          }
        : f
    )
  );
}

function toggleBookmark(id: number) {
  feeds.update(items =>
    items.map(f =>
      f.id === id
        ? { ...f, isBookmarked: !f.isBookmarked }
        : f
    )
  );
}

export const feedStore = {
  feeds,
  filter,
  loading,
  filteredFeeds,
  loadFeeds,
  setFilter,
  toggleLike,
  toggleBookmark
};
