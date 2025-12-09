// routes/calendar/add/page.ts
import { get } from 'svelte/store';
import { auth, clearAuth } from '$lib/stores/auth';
import { userProfile } from '$lib/stores/profile';
import { goto } from '$app/navigation';

export interface AddCalendarState {
  isLoggedIn: boolean;
  isLoading: boolean;
  loginMessage: string;
}

export function initCalendarAddPage(): AddCalendarState {
  const tokenState = get(auth);

  if (!tokenState?.access_token) {
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

export async function submitCalendar(event: CustomEvent<FormData>) {
  const tokenState = get(auth);

  if (!tokenState?.access_token) {
    alert('로그인이 필요합니다.');
    goto('/login');
    return;
  }
  const res = await fetch('/api/me/calendar/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${tokenState.access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(event.detail)
  });

  if (res.ok) {
    alert('일정이 추가되었습니다! 🎉');
    goto('/profile');
  } else if (res.status === 401) {
    alert('권한이 없습니다. 로그인 후 다시 시도해주세요.');
    clearAuth();
    userProfile.set(null);
    goto('/login');
  } else {
    alert('일정 추가 실패');
  }
}

export function cancel() {
  goto('/profile');
}
