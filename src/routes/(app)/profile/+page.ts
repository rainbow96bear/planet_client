// src/routes/profile/+page.ts
import { get } from 'svelte/store';
import { auth } from '$lib/stores/auth';
import { goto } from '$app/navigation';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
  const tokenState = get(auth);
  
  if (!tokenState?.access_token) {
    return { isLoggedIn: false }; // 로그인 안 된 상태 처리
  }

  try {
    const res = await fetch('/api/me/profile', {
      headers: { Authorization: `Bearer ${tokenState.access_token}` }
    });

    if (!res.ok) {
      return { isLoggedIn: false };
    }

    const profile = await res.json();
    if (!profile?.nickname) return { isLoggedIn: false };

    // 로그인 상태면 닉네임 페이지로 이동
    goto(`/profile/${profile.nickname}`);
    return { isLoggedIn: true };
  } catch {
    return { isLoggedIn: false };
  }
};
