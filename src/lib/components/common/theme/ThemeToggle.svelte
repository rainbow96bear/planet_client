<script lang="ts">
  import { theme } from '$lib/stores/theme';
  
  let currentTheme: 'light' | 'dark' = 'light';
  
  theme.subscribe(value => {
    currentTheme = value;
  });
  
  function toggleTheme() {
    theme.toggle();
  }
</script>

<button class="theme-toggle" on:click={toggleTheme} title="테마 변경">
  {#if currentTheme === 'light'}
    🌙
  {:else}
    ☀️
  {/if}
</button>

<style>
  .theme-toggle {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: 1px solid var(--border-color);
    background: var(--bg-primary);
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .theme-toggle:hover {
    background: var(--bg-secondary);
    transform: scale(1.05);
  }

  .theme-toggle:active {
    transform: scale(0.95);
  }
</style>