<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { theme, profileState, auth, clearAuth, isLoggedIn } from '$lib/stores';
  import { initAuth } from '$lib/stores/auth';
  import ThemeSelector from '$lib/components/common/themeSelector/ThemeSelector.svelte';
  import LoginRequired from '$lib/components/common/loginRequired/LoginRequired.svelte';
  import styles from './settings.module.css';
  import type { Theme } from '$lib/stores/theme';

  let isLoading = true;
  let loginMessage = '';

  onMount(async () => {
    // 1. 인증 초기화
    await initAuth();

    // 2. 토큰 확인
    const tokenState = get(auth);
    if (!tokenState?.access_token) {
      loginMessage = '설정을 이용하려면 로그인이 필요합니다.';
      isLoading = false;
      return;
    }

    if (!get(isLoggedIn)) {
      loginMessage = '로그인이 필요합니다.';
      isLoading = false;
      return;
    }

    const profile = get(profileState);
    if (!profile) {
      loginMessage = '프로필 정보가 없습니다.';
      clearAuth();
    }

    isLoading = false;
  });

  async function handleThemeChange(event: CustomEvent<Theme>) {
    const newTheme = event.detail;
    theme.setTheme(newTheme);

    const tokenState = get(auth);
    if (!tokenState?.access_token) return;

    try {
      await fetch('/api/user/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenState.access_token}`,
        },
        body: JSON.stringify({ theme: newTheme }),
      });
    } catch (err) {
      console.error('테마 저장 실패:', err);
    }
  }

  async function handleLogout() {
    if (!confirm('로그아웃 하시겠습니까?')) {
      return;
    }

    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (!res.ok) {
        throw new Error('Logout failed');
      }

      clearAuth();
      profileState.set(null);
      await goto('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('로그아웃에 실패했습니다.');
    }
  }
</script>

{#if isLoading}
  <!-- 로딩 상태 -->
  <div class={styles.loadingContainer}>
    <div class={styles.spinner}></div>
    <p>잠시만 기다려주세요...</p>
  </div>
{:else if !isLoggedIn}
  <!-- 로그인 필요 -->
  <LoginRequired message={loginMessage} />
{:else}
  <!-- 설정 화면 -->
  <div class={styles.settingsContainer}>
    <header class={styles.settingsHeader}>
      <button class={styles.backBtn} on:click={() => history.back()}>← 뒤로</button>
      <h1 class={styles.headerTitle}>설정</h1>
      <div class={styles.headerPlaceholder}></div>
    </header>

    <main class={styles.settingsContent}>
      <!-- 프로필 -->
      <section class={styles.section}>
        <h2 class={styles.sectionTitle}>프로필</h2>
        <div class={`${styles.card} ${styles.profileCard}`}>
          <div class={styles.profileInfo}>
            <div class={styles.avatar}>
              {#if $profileState?.profile?.profile_image}
                <img 
                  src={$profileState.profile.profile_image} 
                  alt="프로필" 
                  class={styles.avatarImage}
                />
              {:else}
                🪐
              {/if}
            </div>
            <div class={styles.userDetails}>
              <div class={styles.username}>{$profileState?.profile?.nickname || '사용자'}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- 테마 -->
      <section class={styles.section}>
        <h2 class={styles.sectionTitle}>테마</h2>
        <ThemeSelector currentTheme={$theme} on:change={handleThemeChange} />
      </section>

      <!-- 로그아웃 -->
      <button class={styles.logoutBtn} on:click={handleLogout}>로그아웃</button>
    </main>
  </div>
{/if}