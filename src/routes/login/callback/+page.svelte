<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Loading from '$lib/components/loading/Loading.svelte';

  onMount(async () => {
    const url = new URL(window.location.href);
    const status = url.searchParams.get('status');

    if (status !== 'success') {
      goto('/');
      return;
    }

    // ✅ 서버에 로그인 완료 요청
    const res = await fetch('/api/auth/token/access', {
      method: 'POST',
      credentials: 'include'
    });

    if (!res.ok) {
      goto('/');
      return;
    }

    // ✅ 다음 요청에서 서버가 로그인 판정
    const redirect = localStorage.getItem('redirectAfterLogin') || '/';
    localStorage.removeItem('redirectAfterLogin');
    goto(redirect);
  });
</script>

<Loading message="로그인 처리 중..." />
