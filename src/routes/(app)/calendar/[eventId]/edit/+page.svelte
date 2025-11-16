<script lang="ts">
  import CalendarForm from '$lib/components/common/calendar/CalendarForm.svelte';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { auth, clearAuth } from '$lib/stores/auth';
  import { profileState } from '$lib/stores/profileState';

  import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import LoginRequired from '$lib/components/common/loginRequired/LoginRequired.svelte';
	import LoadingSpinner from '$lib/components/common/loadingSpinner/LoadingSpinner.svelte';

  let eventData: Record<string, any> = {};
  let isLoggedIn = false;
  let isLoading = true;
  let loginMessage = '';

  onMount(async () => {
    const tokenState = get(auth);

    if (!tokenState?.access_token) {
      loginMessage = '로그인이 필요합니다.';
      isLoading = false;
      return;
    }

    isLoggedIn = true;

    const eventId = $page.params.eventId;
    try {
      const res = await fetch(`/api/calendar/${eventId}`, {
        headers: { Authorization: `Bearer ${tokenState.access_token}` },
      });

      if (res.ok) eventData = await res.json();
      else if (res.status === 401) {
        loginMessage = '권한이 없습니다. 로그인 후 다시 시도해주세요.';
        clearAuth();
        profileState.set(null);
      } else loginMessage = '일정 정보를 불러오는 중 오류가 발생했습니다.';
    } catch (err) {
      console.error(err);
      loginMessage = '일정 정보를 불러오는 중 오류가 발생했습니다.';
    } finally {
      isLoading = false;
    }
  });

  async function handleSubmit(event: CustomEvent<FormData>) {
    const tokenState = get(auth);
    if (!tokenState?.access_token) {
      loginMessage = '로그인이 필요합니다.';
      return;
    }

    const eventId = $page.params.eventId;
    const res = await fetch(`/api/calendar/${eventId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${tokenState.access_token}` },
      body: event.detail,
    });

    if (res.ok) {
      alert('일정이 수정되었습니다!');
      goto(`/profile`);
    } else if (res.status === 401) {
      loginMessage = '권한이 없습니다. 로그인 후 다시 시도해주세요.';
      clearAuth();
      profileState.set(null);
      goto('/login');
    } else {
      loginMessage = '수정 실패';
    }
  }

  function handleCancel() {
    goto(`/profile`);
  }
</script>

{#if isLoading}
  <!-- 로딩 상태 표시 -->
  <div class="loading-container">
    <div class="spinner"></div>
    <p>잠시만 기다려주세요...</p>
  </div>
{:else if !isLoggedIn || loginMessage}
  <LoginRequired message={loginMessage} />
{:else if Object.keys(eventData).length > 0}
  <CalendarForm
    {eventData}
    on:submit={handleSubmit}
    on:cancel={handleCancel}
  />
{:else}
  <LoadingSpinner message="일정을 불러오는 중입니다..." />
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
