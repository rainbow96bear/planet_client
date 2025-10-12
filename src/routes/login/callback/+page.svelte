<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  onMount(async () => {
    const url = new URL(window.location.href);
    const status = url.searchParams.get('status');
    const code = url.searchParams.get('code');

    if (status === 'success') {
      try {
        // refresh_token은 쿠키에 저장되어 있다고 가정
        const res = await fetch('/api/auth/token/access', {
          method: 'POST',
          credentials: 'include', // 쿠키 포함 필수
        });

        if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`);
        const data = await res.json();
        console.log("access token : ", data.access_token)

        // 로그인 전 페이지로 이동
        const redirect = localStorage.getItem('redirectAfterLogin') || '/';
        localStorage.removeItem('redirectAfterLogin');
        goto(redirect);
      } catch (err) {
        console.error('토큰 재발급 실패:', err);
      }
    } else if (status === 'error') {
      console.error('로그인 실패:', code);
    }
  });
</script>

<p>로그인 처리 중...</p>