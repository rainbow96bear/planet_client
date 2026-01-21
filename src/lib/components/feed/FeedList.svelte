<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import FeedCard from './FeedCard.svelte';
  import type { FeedItem } from '$lib/stores/feed';

  export let feeds: FeedItem[];

  const dispatch = createEventDispatcher<{
    like: number;
    bookmark: number;
  }>();
</script>

{#each feeds as feed (feed.id)}
  <FeedCard
    {feed}
    on:like={() => dispatch('like', feed.id)}
    on:bookmark={() => dispatch('bookmark', feed.id)}
  />
{/each}
