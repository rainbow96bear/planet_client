// -----------------------------
// Todo 타입
// -----------------------------
export interface Todo {
  id: string; 
  EventID: string; // FK to CalendarDayEvent.eventId (UUID)
  UserID: string;  // Todo 소유자 ID (UUID)
  content: string; // 할 일 내용
  isDone: boolean; 
  dueTime?: string;
}

// -----------------------------
// CalendarEvent
// -----------------------------
export interface CalendarEvent {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  emoji?: string;
  visibility?: 'private' | 'public';
  createdAt?: string;
  updatedAt?: string;
}

// -----------------------------
// CalendarDayEvent: popup에서 todos fetch 후 저장
// -----------------------------
export interface CalendarDayEvent extends CalendarEvent {
  todos?: Todo[];
}

// -----------------------------
// CalendarData: 달력 전체 데이터
// -----------------------------
export interface CalendarData {
  events: CalendarDayEvent[];
  completionData: Record<number, number>; // day: completion % (0-100)
  monthData: (number | null)[][];         // 달력 그리드 데이터
  year: number;
  month: number;
}

// -----------------------------
// 일정 생성/수정 요청 타입
// -----------------------------
export interface CalendarEventInput {
  title: string;
  description?: string;
  emoji: string;
  startAt: string;
  endAt: string;
  visibility: 'public' | 'friends' | 'private';
}

// -----------------------------
// 일정 필터 옵션
// -----------------------------
export interface CalendarFilter {
  year: number;
  month: number;
  visibility?: 'public' | 'friends' | 'private';
}

// -----------------------------
// 월별 데이터 타입
// -----------------------------
export interface MonthDataWithEvents {
  day: number;
  dayEvents: CalendarEvent[];
  isSunday: boolean;
  isSaturday: boolean;
}

// -----------------------------
// 월별 데이터 매트릭스
// -----------------------------
export type MonthData = (number | null)[][];

// null 포함 가능하도록 안전하게 정의
export type MonthDataWithEventsRow = (MonthDataWithEvents | null)[];
export type MonthDataWithEventsMatrix = MonthDataWithEventsRow[];
