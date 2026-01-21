<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { FeedFilter } from '$lib/stores/feed';
  import styles from './FeedFilterTabs.module.css';

  export let selected: FeedFilter;
  const dispatch = createEventDispatcher();
</script>

<div class={styles.tabs}>
  <button
    class={`${styles.tab} ${selected === 'all' ? styles.active : ''}`}
    on:click={() => dispatch('change', 'all')}
  >
    전체
  </button>

  <button
    class={`${styles.tab} ${selected === 'following' ? styles.active : ''}`}
    on:click={() => dispatch('change', 'following')}
  >
    팔로잉
  </button>

  <button
    class={`${styles.tab} ${selected === 'popular' ? styles.active : ''}`}
    on:click={() => dispatch('change', 'popular')}
  >
    인기
  </button>
</div>
