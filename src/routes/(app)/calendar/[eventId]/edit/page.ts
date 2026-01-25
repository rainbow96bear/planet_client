// src/routes/.../page.ts
import { get } from 'svelte/store';
import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { auth, user } from '$lib/stores';
import { apiFetch } from '$lib/client/apiFetch';

export interface EditCalendarState {
  isLoading: boolean;
  isLoggedIn: boolean;
  loginMessage: string;
  eventData?: Record<string, any>;
}

export interface EventPayload {
  title: string;
  emoji: string;
  startAt: string;
  endAt: string;
  description: string;
  visibility: 'public' | 'friends' | 'private';
  todos: { content: string; completed: boolean }[];
  imageUrl: string | null;
}

/**
 * 페이지 초기화
 */
export async function initCalendarEditPage(): Promise<EditCalendarState> {
  const { accessToken } = get(auth);

  if (!accessToken) {
    return {
      isLoading: false,
      isLoggedIn: false,
      loginMessage: '로그인이 필요합니다.'
    };
  }

  const eventId = get(page).params.eventId;

  try {
    const res = await apiFetch(`/api/calendar/events/${eventId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
    });

    if (res.ok) {
      const eventData = await res.json();
      return {
        isLoading: false,
        isLoggedIn: true,
        loginMessage: '',
        eventData
      };
    }

    if (res.status === 401) {
      logoutAndRedirect();
      return {
        isLoading: false,
        isLoggedIn: false,
        loginMessage: '권한이 만료되었습니다. 다시 로그인해주세요.'
      };
    }

    if (res.status === 404) {
      return {
        isLoading: false,
        isLoggedIn: true,
        loginMessage: '일정 정보를 찾을 수 없습니다.'
      };
    }

    return {
      isLoading: false,
      isLoggedIn: true,
      loginMessage: '일정 정보를 불러오는 중 오류가 발생했습니다.'
    };
  } catch (e) {
    console.error(e);
    return {
      isLoading: false,
      isLoggedIn: true,
      loginMessage: '서버 통신 중 오류가 발생했습니다.'
    };
  }
}

/**
 * 일정 수정
 */
export async function submitCalendar(event: CustomEvent<EventPayload>) {
  const eventId = get(page).params.eventId;
  const token = get(auth).accessToken;

  if (!token) {
    goto('/login');
    return;
  }

  try {
    const res = await apiFetch(`/api/me/calendar/events/${eventId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event.detail)
    });

    if (res.ok) {
      const nickname = get(user)?.nickname ?? 'me';
      goto(`/profile/${nickname}`);
      return;
    }

    if (res.status === 401) {
      logoutAndRedirect();
      return;
    }

    alert('일정 수정에 실패했습니다.');
  } catch (e) {
    console.error(e);
    alert('네트워크 오류가 발생했습니다.');
  }
}

/**
 * 취소
 */
export function cancel() {
  const nickname = get(user)?.nickname ?? 'me';
  goto(`/profile/${nickname}`);
}

function logoutAndRedirect() {
  user.set({
    id: null,
    nickname: null,
    profileImage: undefined,
    bio: '',
    theme: 'light'
  });
  goto('/login');
}
