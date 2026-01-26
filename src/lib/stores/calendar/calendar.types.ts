// lib/stores/calendar/calendar.types.ts
export type CalendarEvent = {
  id: string;
  userId: string;
  title: string;
  date: string; // YYYY-MM-DD
  isPublic: boolean;
};
