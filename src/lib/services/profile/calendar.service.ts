// lib/services/calendar.service.ts
import { calendarStore } from '$lib/stores/calendar/calendar.store';
import type { CalendarEvent } from '$lib/stores/calendar/calendar.types';

export const calendarService = {
  applyUserCalendar(userId: string, events: CalendarEvent[]) {
    calendarStore.setUserEvents(userId, events);
  },

  applyFeed(events: CalendarEvent[]) {
    calendarStore.setFeedEvents(events);
  }
};
