<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  export let placeholder: string = '검색...';
  export let recentSearches: string[] = [];

  let isFocused = false;
  let query = '';

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
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
  <span class="search-icon">🔍</span>
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
            <span>🔍</span>
            <span>{item}</span>
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
.search-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
}

.search-icon {
  margin-right: 0.5rem;
}

.search-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-primary);
  outline: none;
  font-size: 0.875rem;
}

.search-input:focus {
  border-color: var(--color-primary);
}

.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  margin-top: 0.25rem;
  box-shadow: var(--shadow-md);
  z-index: 10;
}

.search-recent {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
}

.search-section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  padding: 0 0.75rem;
  margin-bottom: 0.25rem;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
}

.search-item:hover {
  background: var(--bg-secondary);
  border-radius: 0.25rem;
}
</style>
