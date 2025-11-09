export interface CalendarEvent {
  id: number;
  title: string;
  start_at: string;   // "YYYY-MM-DD" 형식
  end_at: string;     // "YYYY-MM-DD" 형식
  visibility: 'public' | 'friends' | 'private';
  emoji: string;
}

export interface CalendarData {
  events: CalendarEvent[];
  completionData: Record<number, number>; // day: completion %
  monthData?: (number | null)[][];
}
