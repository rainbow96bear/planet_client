// src/routes/feed/+page.ts
import type { PageLoad } from './$types';
import { feedStore } from '$lib/stores/feed';
import { mockFeeds } from '$lib/stores/feed/feed.mock';

export const load: PageLoad = async () => {
  // mock == API라고 가정
  feedStore.loadFeeds();

  return {};
};
