// src/lib/services/profile/calendar.service.ts
import { get } from 'svelte/store';
import { user, auth } from '$lib/stores';
import { apiFetch } from '$lib/client/apiFetch';
import type { CalendarEvent } from '$lib/types/calendar';

export async function loadCalendar(
  nickname: string,
  year: number,
  month: number
): Promise<CalendarEvent[]> {
  try {
    const isMine = get(user)?.nickname === nickname;
    let url = '/api/calendar'

    url += `?year=${year}&month=${month}`;

    const token = isMine ? get(auth)?.accessToken : undefined;
    const res = await apiFetch(url, { accessToken: token });
    if (!res.ok) throw new Error();

    return await res.json();
  } catch {
    return [];
  }
}
