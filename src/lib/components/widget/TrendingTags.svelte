<script lang="ts">
  import { goto } from '$app/navigation';

  export let trendingTags: { tag: string; count: number }[] = [];
  export let onSelectTag: (tag: string) => void = () => {};


  function handleClick(tag: string) {
    onSelectTag(tag);
  }
</script>

<div class="widget trending-widget">
  <h2 class="widget-title">트렌딩 태그</h2>

  <div class="widget-content">
    {#each trendingTags as trend, index}
      <button class="trend-item" on:click={() => handleClick(trend.tag)}>
        <div class="trend-rank">{index + 1}</div>
        <div class="trend-info">
          <div class="trend-tag">#{trend.tag}</div>
          <div class="trend-count">{trend.count} 게시물</div>
        </div>
      </button>
    {/each}
  </div>

  <button class="widget-more" on:click={() => goto('/trending')}>더보기</button>
</div>

<style>
  .widget {
    background: var(--bg-primary);
    border-radius: 1rem;
    padding: 1rem;
    border: 1px solid var(--border-light);
  }

  .widget-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
  }

  .widget-content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .trend-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.75rem;
    transition: background 0.2s;
  }

  .trend-item:hover {
    background: var(--bg-secondary);
  }

  .trend-rank {
    font-weight: bold;
    font-size: 1rem;
    width: 1.5rem;
    text-align: center;
    color: var(--color-primary);
  }

  .trend-tag {
    font-weight: 600;
    color: var(--text-primary);
  }

  .trend-count {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }

  .widget-more {
    width: 100%;
    margin-top: 0.75rem;
    background: none;
    border: none;
    color: var(--color-primary);
    font-weight: 600;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.75rem;
    transition: background 0.2s;
  }

  .widget-more:hover {
    background: var(--bg-secondary);
  }
</style>
