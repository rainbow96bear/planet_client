<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { auth } from '$lib/stores/auth';
  import { decodeJwt } from '$lib/utils/jwt';
  import LoadingSpinner from '$lib/components/common/loadingSpinner/LoadingSpinner.svelte';

  onMount(async () => {
    const url = new URL(window.location.href);
    const status = url.searchParams.get('status');

    if (status === 'success') {
      try {
        const res = await fetch('/api/auth/token/access', {
          method: 'POST',
          credentials: 'include',
        });

        if (!res.ok) {
          console.error('AccessToken 재발급 실패');
          goto('/');
          return;
        }

        // ---- Access Token 추출 ----
        const authHeader = res.headers.get("Authorization");
        const accessToken = authHeader?.replace("Bearer ", "") ?? null;
        if (!accessToken) {
          console.error('Auth 헤더에서 토큰 없음');
          goto('/');
          return;
        }

        // ---- AccessToken 디코딩 ----
        const payload = decodeJwt(accessToken);
        if (!payload) {
          console.error('JWT decode 실패');
          goto('/');
          return;
        }

        const userId = payload.userId || payload.sub || null;
        const expiresAt = payload.exp ? payload.exp * 1000 : null; // ms 단위
        // ---- Store에 저장 ----
        auth.set({
          accessToken,
          userId,
          expiresAt,
          isLoggedIn:true
        });

        // ---- 원래 페이지로 이동 ----
        const redirect = localStorage.getItem('redirectAfterLogin') || '/';
        localStorage.removeItem('redirectAfterLogin');
        goto(redirect);

      } catch (err) {
        console.error('Callback 처리 오류:', err);
        goto('/');
      }

    } else if (status === 'error') {
      goto('/');
    }
  });
</script>

<LoadingSpinner message="로그인 처리 중..." />
