<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth/auth.store';
  import styles from './HeaderActions.module.css';
  import ProfileImg from '$lib/components/ui/ProfileImg/ProfileImg.svelte';

  export let isMenuOpen: boolean;
  const dispatch = createEventDispatcher();

  function handleToggleMenu() {
    dispatch('toggleMenu');
  }
</script>

<div class={styles.headerActions}>
  {#if authStore.isLoggedIn}
    <button
      class={`${styles.iconBtn} ${styles.desktopOnly}`}
      on:click={() => goto('/explore')}
      title="탐색"
    >
      🌍
    </button>

    <button
      class={styles.avatarBtn}
      on:click={() => goto('/profile')}
      title="프로필"
    >
      <ProfileImg
        src={$authStore.user?.profileImage}
        alt={$authStore.user?.nickname ?? ''}
        size={40}
      />
    </button>

    <button
      class={`${styles.menuBtn} ${styles.mobileOnly}`}
      on:click={handleToggleMenu}
    >
      {isMenuOpen ? '✕' : '☰'}
    </button>
  {:else}
    <button
      class={styles.signupBtn}
      on:click={() => goto('/login')}
    >
      시작하기
    </button>
  {/if}
</div>
