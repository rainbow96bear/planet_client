<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let currentTheme: 'light' | 'dark' = 'light';
  const dispatch = createEventDispatcher();

  function selectTheme(newTheme: 'light' | 'dark') {
    currentTheme = newTheme; // 컴포넌트 내부 상태
    dispatch('change', { theme: newTheme }); // 외부에서 이벤트 받기
  }
</script>

<div class="theme-options">
  <button 
    class="theme-option"
    class:active={currentTheme === 'light'}
    on:click={() => selectTheme('light')}
  >
    <div class="theme-preview light-preview">
      <div class="preview-header"></div>
      <div class="preview-content">
        <div class="preview-line"></div>
        <div class="preview-line short"></div>
      </div>
    </div>
    <span class="theme-name">라이트 모드</span>
    {#if currentTheme === 'light'}
      <span class="check-icon">✓</span>
    {/if}
  </button>

  <button 
    class="theme-option"
    class:active={currentTheme === 'dark'}
    on:click={() => selectTheme('dark')}
  >
    <div class="theme-preview dark-preview">
      <div class="preview-header"></div>
      <div class="preview-content">
        <div class="preview-line"></div>
        <div class="preview-line short"></div>
      </div>
    </div>
    <span class="theme-name">다크 모드</span>
    {#if currentTheme === 'dark'}
      <span class="check-icon">✓</span>
    {/if}
  </button>
</div>

<style>
  .theme-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .theme-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: 0.75rem;
    border: 2px solid var(--border-light);
    background: var(--bg-secondary);
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }

  .theme-option:hover {
    border-color: var(--color-primary);
  }

  .theme-option.active {
    border-color: var(--color-primary);
    background: var(--bg-primary);
  }

  .theme-preview {
    width: 100%;
    aspect-ratio: 4 / 3;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
  }

  .light-preview { background: #FFFFFF; }
  .dark-preview { background: #1F2937; }

  .preview-header { height: 30%; background: linear-gradient(135deg, #7DBDB6, #8B9DC3); }

  .preview-content {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .light-preview .preview-line { height: 0.5rem; background: #E5E7EB; border-radius: 0.25rem; }
  .dark-preview .preview-line { height: 0.5rem; background: #374151; border-radius: 0.25rem; }

  .preview-line.short { width: 60%; }

  .theme-name { font-size: 0.875rem; font-weight: 600; color: var(--text-primary); }

  .check-icon {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background: var(--color-primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: bold;
  }
</style>
