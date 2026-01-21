// src/routes/feed/+page.ts
import type { PageLoad } from './$types';
import { feedStore } from '$lib/stores/feed';

export const load: PageLoad = async () => {
  feedStore.loadFeeds();
  return {};
};
