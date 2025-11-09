<script lang="ts">
  import CalendarForm from '$lib/components/common/calendar/CalendarForm.svelte';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { auth, clearAuth } from '$lib/stores/auth';
  import { userProfile } from '$lib/stores/userProfile';
  import { get } from 'svelte/store';
	import LoginRequired from '$lib/components/common/loginRequired/LoginRequired.svelte';

  let isLoggedIn = false;
  let isLoading = true;
  let loginMessage = '';

  onMount(() => {
    const tokenState = get(auth);

    if (!tokenState?.access_token) {
      loginMessage = '로그인이 필요합니다.';
      isLoading = false;
      return;
    }

    isLoggedIn = true;
    isLoading = false;
  });

  async function handleSubmit(event: CustomEvent<FormData>) {
    const tokenState = get(auth);

    if (!tokenState?.access_token) {
      alert('로그인이 필요합니다.');
      goto('/login');
      return;
    }

    const res = await fetch('/api/calendar', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenState.access_token}`
      },
      body: event.detail
    });

    if (res.ok) {
      alert('일정이 추가되었습니다! 🎉');
      goto(`/profile`);
    } else if (res.status === 401) {
      alert('권한이 없습니다. 로그인 후 다시 시도해주세요.');
      clearAuth();
      userProfile.set(null);
      goto('/login');
    } else {
      alert('일정 추가 실패');
    }
  }

  function handleCancel() {
    goto(`/profile`);
  }
</script>

{#if isLoading}
  <!-- 토큰 확인 중 로딩 표시 -->
  <div class="loading-container">
    <div class="spinner"></div>
    <p>잠시만 기다려주세요...</p>
  </div>
{:else if !isLoggedIn}
  <!-- 로그인 필요 메시지 -->
  <LoginRequired message={loginMessage} />
{:else}
  <CalendarForm
    on:submit={handleSubmit}
    on:cancel={handleCancel}
  />
{/if}

<style>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;
  color: var(--text-primary);
}

.spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
