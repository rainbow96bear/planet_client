<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let placeholder: string = '검색...';
  export let recentSearches: string[] = [];

  let isFocused = false;
  let query = '';

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && query.trim()) {
      dispatch('search', { query });
      isFocused = false;
    }
  }

  function handleClickRecent(item: string) {
    query = item;
    dispatch('search', { query });
    isFocused = false;
  }
</script>

<div class="search-container desktop-only">
  <input
    type="text"
    class="search-input"
    bind:value={query}
    placeholder={placeholder}
    on:focus={() => isFocused = true}
    on:blur={() => setTimeout(() => isFocused = false, 200)}
    on:keypress={handleKeyPress}
  />

  {#if isFocused && recentSearches.length > 0}
    <div class="search-dropdown">
      <div class="search-recent">
        <div class="search-section-title">최근 검색</div>
        {#each recentSearches as item}
          <button class="search-item" on:click={() => handleClickRecent(item)}>
            {item}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
.search-container {
  position: relative;
  width: 100%;
  max-width: 400px;
}

.search-input {
  width: 100%;
  padding: 0.6rem 1rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(125, 189, 182, 0.15);
}

.search-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  z-index: 20;
  overflow: hidden;
}

.search-recent {
  display: flex;
  flex-direction: column;
}

.search-section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
}

.search-item {
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  text-align: left;
  font-size: 0.875rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: background 0.2s;
}

.search-item:hover {
  background: var(--bg-secondary);
}
</style>
