// routes/calendar/add/page.ts
import { get } from 'svelte/store';
import { auth, isLoggedIn, clearAuth } from '$lib/stores';
import { user } from '$lib/stores';
import { goto } from '$app/navigation';

export interface AddCalendarState {
  isLoggedIn: boolean;
  isLoading: boolean;
  loginMessage: string;
}

/**
 * 페이지 진입 시 상태 초기화
 */
export function initCalendarAddPage(): AddCalendarState {
  const loggedIn = get(isLoggedIn);

  if (!loggedIn) {
    return {
      isLoggedIn: false,
      isLoading: false,
      loginMessage: '로그인이 필요합니다.'
    };
  }

  return {
    isLoggedIn: true,
    isLoading: false,
    loginMessage: ''
  };
}

/**
 * 일정 추가 제출
 */
export async function submitCalendar(event: CustomEvent<FormData>) {
  const loggedIn = get(isLoggedIn);
  const { accessToken } = get(auth);

  // 이중 방어
  if (!loggedIn || !accessToken) {
    alert('로그인이 필요합니다.');
    goto('/login');
    return;
  }

  try {
    const res = await fetch('/api/calendar/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(event.detail)
    });

    if (res.ok) {
      alert('일정이 추가되었습니다! 🎉');
      goto('/profile');
      return;
    }

    // 인증 만료
    if (res.status === 401) {
      handleUnauthorized();
      return;
    }

    alert('일정 추가에 실패했습니다.');
  } catch (err) {
    console.error('submitCalendar error:', err);
    alert('네트워크 오류가 발생했습니다.');
  }
}

/**
 * 취소
 */
export function cancel() {
  goto('/profile');
}

/**
 * 인증 만료 공통 처리
 */
function handleUnauthorized() {
  alert('로그인이 만료되었습니다. 다시 로그인해주세요.');

  clearAuth();
  user.set({
    id: null,
    nickname: null,
    profileImage: undefined,
    bio: '',
    theme: 'light'
  });

  goto('/login');
}
