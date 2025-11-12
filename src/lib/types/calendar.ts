export interface CalendarEvent {
  eventId: number;           // API 응답의 eventId와 일치
  userUuid: string;          // 이벤트 소유자 UUID
  title: string;
  description?: string;      // 선택적 설명 필드
  emoji: string;
  start_at: string;          // ISO 8601 형식 또는 "YYYY-MM-DD"
  end_at: string;            // ISO 8601 형식 또는 "YYYY-MM-DD"
  visibility: 'public' | 'friends' | 'private';
  created_at?: string;       // 생성 일시
  updated_at?: string;       // 수정 일시
}

export interface CalendarData {
  events: CalendarEvent[];
  completionData: Record<number, number>; // day: completion % (0-100)
  monthData: (number | null)[][];         // 달력 그리드 데이터 (0 또는 null은 빈 날짜)
  year: number;                           // 캘린더 년도
  month: number;                          // 캘린더 월 (1-12)
}

// 일정 생성/수정 요청 타입
export interface CalendarEventInput {
  title: string;
  description?: string;
  emoji: string;
  start_at: string;
  end_at: string;
  visibility: 'public' | 'friends' | 'private';
}

// 일정 필터 옵션
export interface CalendarFilter {
  year: number;
  month: number;
  visibility?: 'public' | 'friends' | 'private';
}