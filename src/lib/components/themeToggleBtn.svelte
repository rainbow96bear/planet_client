<script lang="ts">
  import { theme } from '$lib/stores/theme';
  import { onMount } from 'svelte';

  let currentTheme = 'light';

  onMount(() => {
    const unsubscribe = theme.subscribe((value) => {
      currentTheme = value;
      document.documentElement.className = value;
    });
    return () => unsubscribe();
  });

  function toggleTheme() {
    theme.set(currentTheme === 'dark' ? 'light' : 'dark');
  }
</script>

<button
  on:click={toggleTheme}
  class="theme-toggle-btn"
>
  {currentTheme === 'dark' ? '🌙' : '☀️'}
</button>

<style>
  .theme-toggle-btn {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    padding: 0.5rem 0.5rem;
    border-radius: 50%;
    font-size: 1.5rem;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    z-index: 1000;
    border: none; /* 로고의 청록색 톤 반영 */
    transition: background 0.3s ease, transform 0.2s ease;
  }



  .theme-toggle-btn:active {
    transform: scale(0.95);
  }
</style>