<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { FeedFilter } from '$lib/stores/feed';
  import styles from './FeedFilterTabs.module.css';

  export let selected: FeedFilter;

  const dispatch = createEventDispatcher<{
    change: FeedFilter;
  }>();

  function select(filter: FeedFilter) {
    if (filter === selected) return;
    dispatch('change', filter);
  }
  $: tabClass = (filter: FeedFilter) => {
    return [
      styles.tab,
      selected === filter ? styles.active : ''
    ].join(' ');
  };
</script>

<div class={styles.tabs}>
  <button
    type="button"
    class={tabClass('all')}
    on:click={() => select('all')}
  >
    전체
  </button>

  <button
    type="button"
    class={tabClass('popular')}
    on:click={() => select('popular')}
  >
    인기
  </button>

  <button
    type="button"
    class={tabClass('following')}
    on:click={() => select('following')}
  >
    팔로잉
  </button>
</div>
