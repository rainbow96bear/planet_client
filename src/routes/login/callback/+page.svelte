<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
	import LoadingSpinner from '$lib/components/common/loadingSpinner/LoadingSpinner.svelte';

  onMount(async () => {
    const url = new URL(window.location.href);
    const status = url.searchParams.get('status');
    if (status === 'success') {
      const res = await fetch('/api/auth/token/access', {
        method: 'POST',
        credentials: 'include'
      });

      if (!res.ok) {
        goto('/');
        return;
      }

      const redirect = localStorage.getItem('redirectAfterLogin') || '/';
      localStorage.removeItem('redirectAfterLogin');
      goto(redirect);
    } else {
      goto('/');
    }
  });
</script>
<LoadingSpinner message="로그인 처리 중..." />
