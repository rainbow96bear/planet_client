<script lang="ts">
  import CalendarForm from '$lib/components/CalendarForm.svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount, get } from 'svelte';
  import { auth, clearAuth } from '$lib/stores/auth';
  import { userProfile } from '$lib/stores/userProfile';

  let eventData = {};

  onMount(async () => {
    const tokenState = get(auth);
    const eventId = $page.params.eventId;

    const res = await fetch(`/api/calendar/${eventId}`, {
      headers: tokenState
        ? { Authorization: `Bearer ${tokenState.access_token}` }
        : {},
    });

    if (res.ok) eventData = await res.json();
    else alert('일정 정보를 불러올 수 없습니다.');
  });

  async function handleSubmit(event: CustomEvent<FormData>) {
    const tokenState = get(auth);
    const eventId = $page.params.eventId;

    const res = await fetch(`/api/calendar/${eventId}`, {
      method: 'PUT',
      headers: tokenState
        ? { Authorization: `Bearer ${tokenState.access_token}` }
        : {},
      body: event.detail,
    });

    if (res.ok) {
      alert('일정이 수정되었습니다!');
      goto(`/profile`);
    } else if (res.status === 401) {
      alert('권한이 없습니다. 로그인 후 다시 시도해주세요.');
      clearAuth();
      userProfile.set(null);
      goto('/login');
    } else {
      alert('수정 실패');
    }
  }

  function handleCancel() {
    goto(`/profile`);
  }
</script>

{#if Object.keys(eventData).length > 0}
  <CalendarForm
    {eventData}
    on:submit={handleSubmit}
    on:cancel={handleCancel}
  />
{:else}
  <p>일정을 불러오는 중입니다...</p>
{/if}
