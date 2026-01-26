// lib/stores/calendar/calendar.store.ts
import { writable, derived } from 'svelte/store';
import type { CalendarEvent } from './calendar.types';

type CalendarState = {
  byUser: Record<string, CalendarEvent[]>;
  feed: CalendarEvent[];
};

function createCalendarStore() {
  const store = writable<CalendarState>({
    byUser: {},
    feed: []
  });

  return {
    subscribe: store.subscribe,

    /* 유저별 일정 (내 프로필 / 남 프로필 공용) */
    setUserEvents: (userId: string, events: CalendarEvent[]) =>
      store.update(s => ({
        ...s,
        byUser: { ...s.byUser, [userId]: events }
      })),

    /* 메인 피드용 일정 */
    setFeedEvents: (events: CalendarEvent[]) =>
      store.update(s => ({
        ...s,
        feed: events
      })),

    clearUserEvents: (userId: string) =>
      store.update(s => {
        const { [userId]: _, ...rest } = s.byUser;
        return { ...s, byUser: rest };
      })
  };
}

export const calendarStore = createCalendarStore();
