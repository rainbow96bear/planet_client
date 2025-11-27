<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
	import { auth } from '$lib/stores/auth';
  import {jwtDecode} from 'jwt-decode';
	import LoadingSpinner from '$lib/components/common/loadingSpinner/LoadingSpinner.svelte';

  onMount(async () => {
    const url = new URL(window.location.href);
    const status = url.searchParams.get('status');
    const code = url.searchParams.get('code');
    if (status === 'success') {
      try {
        // 로그인 전 페이지로 이동
        const redirect = localStorage.getItem('redirectAfterLogin') || '/';
        console.log(redirect)
        localStorage.removeItem('redirectAfterLogin');
        goto(redirect);
      } catch (err) {
        console.error('토큰 재발급 실패:', err);
        goto("/");
      }
    } else if (status === 'error') {
      console.error('로그인 실패:', code);
      goto("/");
    }
  });
</script>
<LoadingSpinner message="로그인 처리 중..."/>