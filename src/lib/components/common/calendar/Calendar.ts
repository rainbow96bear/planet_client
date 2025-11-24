import type { CalendarEvent, MonthData, MonthDataWithEventsMatrix } from '$lib/types/calendar';

// 현재 연/월 계산
export function getCurrentYearMonth(year?: number, month?: number) {
  const now = new Date();
  return {
    year: year ?? now.getFullYear(),
    month: month ?? now.getMonth() + 1
  };
}

// 월별 day 배열 생성
export function generateMonthData(year: number, month: number): MonthData {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();
  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstDay).fill(null);

  for (let d = 1; d <= lastDate; d++) {
    week.push(d);
    if (week.length === 7 || d === lastDate) {
      while (week.length < 7) week.push(null);
      weeks.push(week);
      week = [];
    }
  }
  return weeks;
}

// 날짜별 이벤트 map (월 넘어가는 이벤트 처리)
export function precomputeEventsByDate(events: CalendarEvent[], year: number, month: number) {
  const map: Record<number, CalendarEvent[]> = {};
  const targetMonth = month - 1;
  const lastDayOfMonth = new Date(year, month, 0).getDate();

  for (const e of events) {
    const start = new Date(e.startAt);
    const end = new Date(e.endAt);

    const firstDay = start.getMonth() === targetMonth ? start.getDate() : 1;
    const lastDay = end.getMonth() === targetMonth ? end.getDate() : lastDayOfMonth;

    for (let d = firstDay; d <= lastDay; d++) {
      map[d] = map[d] ?? [];
      map[d].push(e);
    }
  }
  return map;
}

// monthData + events + completionData 변환
export function mapMonthDataWithEvents(
  monthData: MonthData,
  events: CalendarEvent[],
  completionData: Record<number, number>,
  year: number,
  month: number,
  eventsByDateMap: Record<number, CalendarEvent[]>
): MonthDataWithEventsMatrix {
  return monthData.map((week, weekIdx) =>
    week.map((day, dayIdx) => {
      if (!day) return null;
      return {
        day,
        dayEvents: eventsByDateMap[day] ?? [],
        completion: completionData[day] ?? 0,
        isSunday: dayIdx === 0,
        isSaturday: dayIdx === 6
      };
    })
  );
}

// completion style
export function getCompletionStyle(completion: number): string {
  if (completion === 0) return 'var(--bg-secondary)';
  if (completion < 50) return 'rgba(125,189,182,0.1)';
  if (completion < 80) return 'rgba(125,189,182,0.2)';
  return 'linear-gradient(135deg, rgba(125,189,182,0.3), rgba(139,157,195,0.3))';
}
