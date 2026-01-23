<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import type { Theme } from './ThemeSelector.types';
  import styles from './ThemeSelector.module.css';

  export let currentTheme: Theme;

  const dispatch = createEventDispatcher<{ change: Theme }>();

  onMount(() => {
    const domTheme = document.documentElement.getAttribute('data-theme') as Theme;
    if (domTheme && domTheme !== currentTheme) {
      currentTheme = domTheme;
    }
  });

  function selectTheme(theme: Theme) {
    currentTheme = theme;
    dispatch('change', theme);
  }
</script>

<div class={styles.themeOptions}>
  <button
    class={`${styles.themeOption} ${currentTheme === 'light' ? styles.active : ''}`}
    on:click={() => selectTheme('light')}
  >
    <span>🌞 라이트 모드</span>
  </button>

  <button
    class={`${styles.themeOption} ${currentTheme === 'dark' ? styles.active : ''}`}
    on:click={() => selectTheme('dark')}
  >
    <span>🌙 다크 모드</span>
  </button>
</div>
