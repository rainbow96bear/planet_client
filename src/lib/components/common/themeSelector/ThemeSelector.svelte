<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import styles from './ThemeSelector.module.css';

  export let currentTheme: string;
  const dispatch = createEventDispatcher();

  onMount(() => {
    const domTheme =
      document.documentElement.getAttribute('data-theme') as 'light' | 'dark';

    if (domTheme && domTheme !== currentTheme) {
      currentTheme = domTheme;
    }
  });

  function selectTheme(newTheme: string) {
    currentTheme = newTheme;
    dispatch('change', newTheme);
  }
</script>

<div class={styles.themeOptions}>
  <button
    class={`${styles.themeOption} ${currentTheme === 'light' ? styles.active : ''}`}
    on:click={() => selectTheme('light')}
  >
    <div class={`${styles.themePreview} ${styles.lightPreview}`}>
      <div class={styles.previewHeader}></div>
      <div class={styles.previewContent}>
        <div class={styles.previewLine}></div>
        <div class={`${styles.previewLine} ${styles.short}`}></div>
      </div>
    </div>
    <span class={styles.themeName}>라이트 모드</span>
    {#if currentTheme === 'light'}
      <span class={styles.checkIcon}>✓</span>
    {/if}
  </button>

  <button
    class={`${styles.themeOption} ${currentTheme === 'dark' ? styles.active : ''}`}
    on:click={() => selectTheme('dark')}
  >
    <div class={`${styles.themePreview} ${styles.darkPreview}`}>
      <div class={styles.previewHeader}></div>
      <div class={styles.previewContent}>
        <div class={styles.previewLine}></div>
        <div class={`${styles.previewLine} ${styles.short}`}></div>
      </div>
    </div>
    <span class={styles.themeName}>다크 모드</span>
    {#if currentTheme === 'dark'}
      <span class={styles.checkIcon}>✓</span>
    {/if}
  </button>
</div>
