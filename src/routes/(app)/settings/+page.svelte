<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { theme, profileState, isLoggedIn } from '$lib/stores';

  import {
    initSettingsPage,
    handleThemeChange,
    handleLogout
  } from './settings';

  import ThemeSelector from '$lib/components/common/themeSelector/ThemeSelector.svelte';
  import LoginRequired from '$lib/components/common/loginRequired/LoginRequired.svelte';
  import styles from './settings.module.css';

  let isLoading = true;
  let loginMessage = '';

  onMount(async () => {
    const ok = await initSettingsPage();

    if (!ok) {
      loginMessage = '로그인이 필요합니다.';
    }

    isLoading = false;
  });
</script>

{#if isLoading}
  <div class={styles.loadingContainer}>
    <div class={styles.spinner}></div>
    <p>잠시만 기다려주세요...</p>
  </div>

{:else if !isLoggedIn || !get(profileState)}
  <LoginRequired message={loginMessage} />

{:else}
  <div class={styles.settingsContainer}>
    <header class={styles.settingsHeader}>
      <button class={styles.backBtn} on:click={() => history.back()}>← 뒤로</button>
      <h1 class={styles.headerTitle}>설정</h1>
      <div class={styles.headerPlaceholder}></div>
    </header>

    <main class={styles.settingsContent}>
      <section class={styles.section}>
        <h2 class={styles.sectionTitle}>프로필</h2>
        <div class={`${styles.card} ${styles.profileCard}`}>
          <div class={styles.profileInfo}>
            <div class={styles.avatar}>
              {#if $profileState?.profile?.profile_image}
                <img src={$profileState.profile.profile_image} />
              {:else}
                🪐
              {/if}
            </div>

            <div class={styles.userDetails}>
              <div class={styles.username}>
                {$profileState?.profile?.nickname || '사용자'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class={styles.section}>
        <h2 class={styles.sectionTitle}>테마</h2>
        <ThemeSelector currentTheme={$theme} on:change={handleThemeChange} />
      </section>

      <button class={styles.logoutBtn} on:click={handleLogout}>
        로그아웃
      </button>
    </main>
  </div>
{/if}
