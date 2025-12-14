// src/routes/profile/+page.ts
import { goto } from '$app/navigation';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
  // layout에서 내려준 데이터 받기
  const { isLoggedIn, profile } = await parent();

  // 1. 로그인 안 된 경우 → 로그인 페이지
  if (!isLoggedIn || !profile) {
    goto('/login');
    return;
  }

  // 2. 로그인 된 경우 → 본인 프로필 페이지
  goto(`/profile/${profile.nickname}`);
};
