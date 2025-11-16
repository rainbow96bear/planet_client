// src/lib/layout/layout.ts
import { onMount } from 'svelte';
import { auth, isLoggedIn } from '$lib/stores/auth';
import { theme } from '$lib/stores/theme';
import { profileState } from '$lib/stores/profileState';
import type { Readable } from 'svelte/store';

export interface SuggestedUser {
  name: string;
  handle: string;
  avatar: string;
  bio: string;
}

export interface TrendingTag {
  tag: string;
  count: number;
}

export interface LayoutState {
  isLoggedIn: boolean;
  suggestedUsers: SuggestedUser[];
  trendingTags: TrendingTag[];
  currentPath: string;
}

// 추천/트렌드 더미 데이터
export const suggestedUsers: SuggestedUser[] = [
  { name: '강하늘', handle: '@haneul_cook', avatar: '👨‍🍳', bio: '요리 블로거' },
  { name: '윤서아', handle: '@seoa_art', avatar: '🎨', bio: '일러스트레이터' },
  { name: '정우진', handle: '@woojin_music', avatar: '🎵', bio: '음악 프로듀서' },
  { name: '김태희', handle: '@taehee_yoga', avatar: '🧘‍♀️', bio: '요가 강사' },
  { name: '박준영', handle: '@junyoung_photo', avatar: '📷', bio: '사진작가' }
];

export const trendingTags: TrendingTag[] = [
  { tag: '운동루틴', count: 1100 },
  { tag: '독서챌린지', count: 856 },
  { tag: '요리일기', count: 742 },
  { tag: '코딩공부', count: 689 },
  { tag: '여행계획', count: 534 }
];

// -----------------------------
// Layout 초기화
// -----------------------------
export function initLayout(currentPathStore: Readable<string>, setState: (state: Partial<LayoutState>) => void) {
  onMount(() => {
    // 로그인 상태 subscribe
    const unsubLogin = isLoggedIn.subscribe(value => {
      setState({ isLoggedIn: value });
    });

    // auth subscribe → profileState, theme 업데이트
    const unsubAuth = auth.subscribe(async (tokenState) => {
      const token = tokenState?.access_token;

      if (!token) {
        theme.setTheme('light');
        profileState.set(null);
        return;
      }

      try {
        const [profileRes, themeRes] = await Promise.all([
          fetch('/api/profile/me', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/user/theme', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        profileState.set(profileRes.ok ? await profileRes.json() : null);

        const themeData = themeRes.ok ? await themeRes.json() : { theme: 'light' };
        theme.setTheme(themeData.theme);

      } catch (err) {
        console.error(err);
        profileState.set(null);
        theme.setTheme('light');
      }
    });

    // currentPath subscribe
    const unsubPath = currentPathStore.subscribe(path => {
      setState({ currentPath: path });
    });

    return () => {
      unsubLogin();
      unsubAuth();
      unsubPath();
    };
  });
}
