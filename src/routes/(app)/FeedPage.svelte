<script lang="ts">
  import { feedStore } from '$lib/stores/feed';

  import FeedFilterTabs from './FeedFilterTabs.svelte';
  import FeedList from './FeedList.svelte';
  import FeedLoading from './FeedLoading.svelte';
  import FeedEmpty from './FeedEmpty.svelte';
</script>

<FeedFilterTabs
  bind:selected={$feedStore.filter}
  on:change={(e) => feedStore.setFilter(e.detail)}
/>

{#if $feedStore.loading}
  <FeedLoading />
{:else if $feedStore.filteredFeeds.length === 0}
  <FeedEmpty />
{:else}
  <FeedList
    feeds={$feedStore.filteredFeeds}
    on:like={(e) => feedStore.toggleLike(e.detail)}
    on:bookmark={(e) => feedStore.toggleBookmark(e.detail)}
  />
{/if}
