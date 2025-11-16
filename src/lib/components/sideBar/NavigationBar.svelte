<!-- src/lib/components/layout/LeftSidebar.svelte -->
<script lang="ts">
  import { goto } from '$app/navigation';
	import type { UserProfile } from '$lib/types/profile';
	import ProfileImg from '../common/profileImg/profileImg.svelte';

  export let currentPath: string = '/';
  export let isLoggedIn: boolean = false;
  export let profile:UserProfile|null=null;
  console.log("dk")
  function isActive(path: string) {
    return currentPath === path;
  }
</script>

  <div class="sidebar-content">
    <!-- 네비게이션 메뉴 -->
    <nav class="nav-menu">
      <button class="nav-item" class:active={isActive('/explore')} on:click={() => goto('/explore')}>
        <span class="nav-icon">🌍</span>
        <span class="nav-text">탐색</span>
      </button>
      {#if isLoggedIn}
        <button class="nav-item" class:active={isActive('/notifications')} on:click={() => goto('/notifications')}>
          <span class="nav-icon">🔔</span>
          <span class="nav-text">알림</span>
        </button>

        <button class="nav-item" class:active={isActive('/messages')} on:click={() => goto('/messages')}>
          <span class="nav-icon">💬</span>
          <span class="nav-text">메시지</span>
        </button>

        <button class="nav-item" class:active={isActive('/bookmarks')} on:click={() => goto('/bookmarks')}>
          <span class="nav-icon">🔖</span>
          <span class="nav-text">북마크</span>
        </button>

        <button class="nav-item" class:active={isActive('/settings')} on:click={() => goto('/settings')}>
          <span class="nav-icon">⚙️</span>
          <span class="nav-text">설정</span>
        </button>
      {/if}
    </nav>

    {#if isLoggedIn}
      <!-- 새 글 작성 버튼 -->
      <button class="create-btn" on:click={() => goto('/create')}>
        <span class="create-icon">✏️</span>
        <span>새 할 일 작성</span>
      </button>

      <!-- 사용자 정보 -->
      <button class="user-profile" on:click={() => goto('/profile')}>
        <ProfileImg src={profile?.profile_image} alt={profile?.nickname} size={40} />
        <div class="profile-info">
          <div class="profile-name">{profile?.nickname} 프로필</div>
        </div>
      </button>
    {/if}
  </div>

<style>
  .sidebar-content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .logo-section {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 1rem;
    transition: background 0.2s;
    margin-bottom: 0.5rem;
  }

  .logo-section:hover {
    background: var(--bg-secondary);
  }

  .logo-icon {
    font-size: 2rem;
  }

  .logo-text {
    font-size: 1.5rem;
    font-weight: bold;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .nav-menu {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.875rem 1rem;
    border: none;
    background: none;
    border-radius: 1rem;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }

  .nav-item:hover {
    background: var(--bg-secondary);
  }

  .nav-item.active {
    background: linear-gradient(135deg, rgba(125,189,182,0.1), rgba(139,157,195,0.1));
    font-weight: 600;
  }

  .nav-icon {
    font-size: 1.5rem;
  }

  .nav-text {
    font-size: 1rem;
    color: var(--text-primary);
  }

  .badge {
    position: absolute;
    top: 0.5rem;
    right: 1rem;
    background: var(--color-primary);
    color: white;
    font-size: 0.625rem;
    font-weight: bold;
    padding: 0.125rem 0.375rem;
    border-radius: 0.5rem;
    min-width: 1.25rem;
    text-align: center;
  }

  .create-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 1rem;
    margin-top: 0.5rem;
    border: none;
    border-radius: 1.5rem;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(125, 189, 182, 0.3);
  }

  .create-btn:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(125, 189, 182, 0.4);
  }

  .create-icon {
    font-size: 1.25rem;
  }

  .user-profile {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    margin-top: auto;
    border: none;
    background: var(--bg-secondary);
    border-radius: 1rem;
    cursor: pointer;
    transition: background 0.2s;
  }

  .user-profile:hover {
    background: var(--border-light);
  }

  .profile-info {
    flex: 1;
    text-align: left;
  }

  .profile-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .profile-handle {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }

  .profile-more {
    color: var(--text-tertiary);
    font-size: 1.25rem;
  }
</style>
