<script lang="ts">
  import { goto } from '$app/navigation';
  import SearchBar from './SearchBar.svelte';
  import HeaderActions from './HeaderActions.svelte';
  import MobileMenu from './MobileMenu.svelte';
	import { get } from 'svelte/store';
	import { userProfile } from '$lib/stores/userProfile';

  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }

  function handleSearch(event: CustomEvent<{ query: string }>) {
    const query = event.detail.query.trim();
    if (query) goto(`/search?q=${encodeURIComponent(query)}`);
  }
</script>

<div class="header">
  <div class="header-container">
    <button class="logo" on:click={() => goto('/')}>
      <div class="logo-icon">🪐</div>
      <span class="logo-text">Planet</span>
    </button>

    {#if $userProfile}
      <SearchBar placeholder="계획, 친구, 태그 검색..." on:search={handleSearch}/>
    {/if}

    <HeaderActions {isMenuOpen} on:toggleMenu={toggleMenu} />
  </div>

  {#if $userProfile && isMenuOpen}
    <MobileMenu on:close={toggleMenu} />
  {/if}
</div>


<style>
/* 공통 Header 스타일 */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--header-bg);
  border-bottom: 1px solid var(--header-border);
  backdrop-filter: blur(var(--header-blur));
  -webkit-backdrop-filter: blur(var(--header-blur));
  box-shadow: var(--shadow-md);
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.header-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  gap: 1rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.75rem;
  transition: all 0.2s;
}

.logo:hover { background: var(--bg-secondary); }

.logo-icon { font-size: 1.75rem; }
.logo-text {
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@media (max-width: 768px) {
  .logo-text { font-size: 1.25rem; }
  .header-container { padding: 0.75rem 1rem; }
}
</style>
