<script lang="ts">
  import { feedStore } from '$lib/stores/feed';

  import FeedFilterTabs from '$lib/components/feed/FeedFilterTabs.svelte';
  import FeedList from '$lib/components/feed/FeedList.svelte';
  import FeedEmpty from '$lib/components/feed/FeedEmpty.svelte';
	import Loading from '$lib/components/loading/Loading.svelte';

  const {
    filter,
    loading,
    filteredFeeds,
    setFilter,
    toggleLike,
    toggleBookmark
  } = feedStore;
</script>

<FeedFilterTabs
  selected={$filter}
  on:change={(e) => setFilter(e.detail)}
/>

{#if $loading}
  <Loading message={"피드를 불러오는 중..."}/>
{:else if $filteredFeeds.length === 0}
  <FeedEmpty />
{:else}
  <FeedList
    feeds={$filteredFeeds}
    on:like={(e) => toggleLike(e.detail)}
    on:bookmark={(e) => toggleBookmark(e.detail)}
  />
{/if}
