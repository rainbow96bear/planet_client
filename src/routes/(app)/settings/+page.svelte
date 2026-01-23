<script lang="ts">
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/user';
  import { isLoggedIn } from '$lib/stores/auth';

  import Loading from '$lib/components/loading/Loading.svelte';
  import LoginRequired from '$lib/components/common/loginRequired/LoginRequired.svelte';

  import ProfileHeader from '$lib/components/profile/ProfileHeader/ProfileHeader.svelte';
  import ProfileHero from '$lib/components/profile/ProfileHero/ProfileHero.svelte';
  import ThemeSelector from '$lib/components/profile/ThemeSettings/ThemeSelector.svelte';
  import AccountActions from '$lib/components/profile/AccountActions/AccountActions.svelte';

  import {
    handleThemeChange,
    updateProfile
  } from '$lib/services/user/user.actions';

  import styles from './page.module.css';

  let isLoading = true;
  let loginMessage = '';
  let isEditMode = false;

  onMount(() => {
    if (!$isLoggedIn) {
      loginMessage = '로그인이 필요합니다.';
    }
    isLoading = false;
  });

  async function handleSave(nickname: string, bio: string) {
    const success = await updateProfile(nickname, bio);

    if (success) {
      isEditMode = false;
    }
  }
</script>

{#if isLoading}
  <Loading />

{:else if !$isLoggedIn}
  <LoginRequired message={loginMessage} />

{:else}
  <ProfileHeader />

  <main class={styles.content}>
    <ProfileHero
      user={$user}
      editable={isEditMode}
      on:edit={() => (isEditMode = true)}
      on:cancel={() => (isEditMode = false)}
      on:save={(e) => handleSave(e.detail.nickname, e.detail.bio)}
    />

    <ThemeSelector
      currentTheme={$user.theme}
      on:change={(e) => handleThemeChange(e.detail)}
    />

    <AccountActions />
  </main>
{/if}
