<script lang="ts">
  import CalendarForm from '$lib/components/common/calendar/CalendarForm.svelte';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';
  import { auth, clearAuth } from '$lib/stores/auth';
  import { userProfile } from '$lib/stores/userProfile';

  async function handleSubmit(event: CustomEvent<FormData>) {
    const tokenState = get(auth);

    const res = await fetch('/api/calendar', {
      method: 'POST',
      headers: tokenState
        ? { Authorization: `Bearer ${tokenState.access_token}` }
        : {},
      body: event.detail,
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

<CalendarForm
  on:submit={handleSubmit}
  on:cancel={handleCancel}
/>
