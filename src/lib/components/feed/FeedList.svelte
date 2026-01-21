<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Feed } from '$lib/stores/feed';
  import FeedCard from './FeedCard.svelte';

  export let feeds: Feed[];
  const dispatch = createEventDispatcher();
</script>

{#each feeds as feed (feed.id)}
  <FeedCard
    {feed}
    on:like={() => dispatch('like', feed.id)}
    on:bookmark={() => dispatch('bookmark', feed.id)}
  />
{/each}
