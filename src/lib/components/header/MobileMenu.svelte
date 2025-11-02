<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  const dispatch = createEventDispatcher();

  function navigate(path: string) {
    goto(path);
    dispatch('closeMenu');
  }
</script>

<div class="mobile-menu">
  <button class="mobile-menu-item" on:click={() => navigate('/explore')}><span>🌍</span><span>탐색</span></button>
  <button class="mobile-menu-item" on:click={() => navigate('/bookmarks')}><span>🔖</span><span>북마크</span></button>
  <button class="mobile-menu-item" on:click={() => navigate('/settings')}><span>⚙️</span><span>설정</span></button>
</div>

<style>
/* 모바일 메뉴 전체 */
.mobile-menu {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem;
  border-top: 1px solid var(--border-light);
  background: var(--bg-primary);
  box-shadow: var(--shadow-md);
  z-index: 100;
}

/* 메뉴 아이템 버튼 */
.mobile-menu-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1rem;
  border: none;
  background: none;
  border-radius: 0.75rem;
  color: var(--text-primary);
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  text-align: left;
}

.mobile-menu-item:hover {
  background: var(--bg-secondary);
  transform: scale(1.02);
}

/* 아이콘과 텍스트 */
.mobile-menu-item span:first-child {
  font-size: 1.25rem;
}
</style>
