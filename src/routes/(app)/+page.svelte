<script lang="ts">
  import { onMount } from 'svelte';
  import FeedCard from '$lib/components/common/feed/FeedCard.svelte';
  import { feedStore, type FeedFilter } from '$lib/stores';
  import styles from './page.module.css';

  let feeds = feedStore.feeds;
  let selectedFilter = feedStore.selectedFilter;
  let isLoading = feedStore.isLoading;

  // onMount(() => {
  //   feedStore.loadFeeds();
  // });

  function handleFilterChange(filter: FeedFilter) {
    feedStore.setFilter(filter);
  }

  function handleLike(event: CustomEvent<number>) {
    feedStore.toggleLike(event.detail);
  }

  function handleComment(event: CustomEvent<number>) {
    console.log('Comment on feed:', event.detail);
    // 댓글 모달 열기 등의 로직
  }

  function handleBookmark(event: CustomEvent<number>) {
    feedStore.toggleBookmark(event.detail);
  }

  function handleShare(event: CustomEvent<number>) {
    console.log('Share feed:', event.detail);
    // 공유 모달 열기 등의 로직
  }

  function handleMore(event: CustomEvent<number>) {
    console.log('More options for feed:', event.detail);
    // 더보기 메뉴 열기 등의 로직
  }
</script>

<div class={styles.mainContainer}>
  <!-- 필터 탭 -->
  <div class={styles.filterTabs}>
    <button 
      class="{styles.filterTab} {$selectedFilter === 'all' ? styles.active : ''}"
      on:click={() => handleFilterChange('all')}
    >
      전체
    </button>
    <button 
      class="{styles.filterTab} {$selectedFilter === 'following' ? styles.active : ''}"
      on:click={() => handleFilterChange('following')}
    >
      팔로잉
    </button>
    <button 
      class="{styles.filterTab} {$selectedFilter === 'popular' ? styles.active : ''}"
      on:click={() => handleFilterChange('popular')}
    >
      인기
    </button>
  </div>

  <!-- 피드 리스트 -->
  {#if $isLoading}
    <div class={styles.loadingContainer}>
      <div class={styles.loadingSpinner}>로딩 중...</div>
    </div>
  {:else if $feeds.length === 0}
    <div class={styles.emptyContainer}>
      <p class={styles.emptyMessage}>표시할 피드가 없습니다.</p>
    </div>
  {:else}
    <div class={styles.feedList}>
      {#each $feeds as feed (feed.id)}
        <div class={styles.feedContainer}>
          <FeedCard 
            {feed} 
            on:like={handleLike}
            on:comment={handleComment}
            on:bookmark={handleBookmark}
            on:share={handleShare}
            on:more={handleMore}
          />
        </div>
      {/each}
    </div>
  {/if}
</div>