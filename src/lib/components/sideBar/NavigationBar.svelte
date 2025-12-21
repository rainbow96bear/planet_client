<script lang="ts">
  import { goto } from '$app/navigation';
  import ProfileImg from '../common/profileImg/profileImg.svelte';
  import { user, isLoggedIn } from '$lib/stores';
  import styles from './NavigationBar.module.css';

  export let currentPath: string = '/';

  function isActive(path: string) {
    return currentPath === path;
  }

  function navigate(path: string) {
    goto(path);
  }
</script>

<div class={styles.sidebarContent}>
  <nav class={styles.navMenu}>
    <button class={styles.navItem} class:active={isActive('/explore')} on:click={() => navigate('/explore')}>
      <span class={styles.navIcon}>🌍</span>
      <span class={styles.navText}>탐색</span>
    </button>

    {#if $isLoggedIn && $user.id}
      <button class={styles.navItem} class:active={isActive('/notifications')} on:click={() => navigate('/notifications')}>
        <span class={styles.navIcon}>🔔</span>
        <span class={styles.navText}>알림</span>
      </button>

      <button class={styles.navItem} class:active={isActive('/messages')} on:click={() => navigate('/messages')}>
        <span class={styles.navIcon}>💬</span>
        <span class={styles.navText}>메시지</span>
      </button>

      <button class={styles.navItem} class:active={isActive('/bookmarks')} on:click={() => navigate('/bookmarks')}>
        <span class={styles.navIcon}>🔖</span>
        <span class={styles.navText}>북마크</span>
      </button>

      <button class={styles.navItem} class:active={isActive('/settings')} on:click={() => navigate('/settings')}>
        <span class={styles.navIcon}>⚙️</span>
        <span class={styles.navText}>설정</span>
      </button>
    {/if}
  </nav>

  {#if $isLoggedIn && $user.id}
    <button class={styles.createBtn} on:click={() => navigate('/calendar/new')}>
      <span class={styles.createIcon}>✏️</span>
      <span>새 할 일 작성</span>
    </button>

    <button class={styles.userProfile} on:click={() => navigate('/profile')}>
      <ProfileImg src={$user.profileImage} alt={$user.nickname || '프로필'} size={40} />
      <div class={styles.profileInfo}>
        <div class={styles.profileName}>{ $user.nickname } 프로필</div>
      </div>
    </button>
  {/if}
</div>
