<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  import ProfileImg from '../common/profileImg/profileImg.svelte';
	import type { UserProfile } from '$lib/types/profile';

  export let isLoggedIn = false;
  export let profile:UserProfile|null;
  export let notificationCount = 0;
  export let isMenuOpen = false; // ✅ 부모에서 전달받음

  const dispatch = createEventDispatcher();

  function handleToggleMenu() {
    dispatch('toggleMenu');
  }
</script>

<div class="header-actions">
  {#if isLoggedIn}
    <button class="icon-btn desktop-only" on:click={() => goto('/explore')} title="탐색">🌍</button>
    <button class="icon-btn" on:click={() => goto('/notifications')} title="알림">
      🔔
      {#if notificationCount > 0}
        <span class="notification-badge">{notificationCount > 99 ? '99+' : notificationCount}</span>
      {/if}
    </button>
    <button class="icon-btn desktop-only" on:click={() => goto('/messages')} title="메시지">💬</button>
    <button class="avatar-btn" on:click={() => goto('/profile')} title="프로필">
        <ProfileImg src={profile?.profile_image} alt={profile?.nickname} size={40} />
    </button>
    <button class="menu-btn mobile-only" on:click={handleToggleMenu}>
      {isMenuOpen ? '✕' : '☰'}
    </button>
  {:else}
    <button class="signup-btn" on:click={() => goto('/login')}>시작하기</button>
  {/if}
</div>

<style>
/* HeaderActions 컨테이너 */
.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 공통 아이콘 버튼 */
.icon-btn {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: none;
  background: var(--bg-secondary);
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: var(--border-light);
  transform: scale(1.05);
}

/* 알림 배지 */
.notification-badge {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  background: #EF4444;
  color: white;
  font-size: 0.625rem;
  font-weight: bold;
  padding: 0.125rem 0.375rem;
  border-radius: 0.75rem;
  min-width: 1rem;
  text-align: center;
}

/* 아바타 버튼 */
.avatar-btn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  border: 2px solid var(--color-primary);
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.avatar-btn:hover {
  transform: scale(1.05);
}

/* 모바일 메뉴 버튼 */
.menu-btn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  border: none;
  background: var(--bg-secondary);
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.menu-btn:hover {
  background: var(--border-light);
}

/* 비로그인 상태 버튼 */
.signup-btn {
  padding: 0.625rem 1.25rem;
  border-radius: 1.25rem;
  border: none;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(125, 189, 182, 0.3);
}

.signup-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(125, 189, 182, 0.4);
}

/* 반응형 */
.desktop-only {
  display: flex;
}

.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
  .mobile-only {
    display: flex;
  }
}
</style>
