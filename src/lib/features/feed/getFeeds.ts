// src/lib/features/feed/getFeeds.ts
import { mockFeeds } from '$lib/stores/feed/feed.mock';

export async function getFeeds() {
  await new Promise(r => setTimeout(r, 600));
  return mockFeeds;
}
