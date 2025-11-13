<script lang="ts">
  import PlanCard from '$lib/components/common/plan/PlanCard.svelte';
  import type { CalendarEvent } from '$lib/types/calendar';
  import { createEventDispatcher } from 'svelte';

  export let events: CalendarEvent[] = [];
  export let completionData: Record<number, number> = {};
  export let monthData: (number | null)[][] = [];
  let selectedDayEvents: CalendarEvent[] = [];
  let selectedDay: number | null = null;
  let showPopup = false;
  const dispatch = createEventDispatcher();

  // monthData에서 년월 정보 추출 (monthData의 첫 번째 유효한 날짜 사용)
  $: currentYearMonth = (() => {
    // monthData에서 첫 번째 유효한 날짜 찾기
    for (const week of monthData) {
      for (const day of week) {
        if (day && day > 0) {
          // 현재 날짜를 기준으로 년월 추정
          const now = new Date();
          const currentYear = now.getFullYear();
          const currentMonth = now.getMonth() + 1;
          
          // 만약 이벤트가 있다면 이벤트의 날짜에서 추출
          if (events.length > 0) {
            const firstEvent = events[0];
            const date = new Date(firstEvent.startAt);
            return { year: date.getFullYear(), month: date.getMonth() + 1 };
          }
          
          // 이벤트가 없으면 현재 날짜 사용
          return { year: currentYear, month: currentMonth };
        }
      }
    }
    
    // monthData가 비어있으면 현재 날짜 사용
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  })();

  // 특정 날짜에 해당하는 이벤트를 필터링
  function getEventsForDay(day: number): CalendarEvent[] {
    if (day === 0 || day === null) return [];
    if (!currentYearMonth) return [];
    
    const filteredEvents = events.filter(event => {
      const startDate = new Date(event.startAt);
      const endDate = new Date(event.endAt);
      
      // 날짜만 비교 (시간 제거)
      const startDay = startDate.getDate();
      const startMonth = startDate.getMonth() + 1;
      const startYear = startDate.getFullYear();
      
      const endDay = endDate.getDate();
      const endMonth = endDate.getMonth() + 1;
      const endYear = endDate.getFullYear();
      
      // 현재 캘린더의 년월과 비교
      const targetYear = currentYearMonth.year;
      const targetMonth = currentYearMonth.month;
      
      // 이벤트가 현재 월에 걸쳐있는지 확인
      const startInCurrentMonth = startYear === targetYear && startMonth === targetMonth;
      const endInCurrentMonth = endYear === targetYear && endMonth === targetMonth;
      const spanningCurrentMonth = 
        (startYear < targetYear || (startYear === targetYear && startMonth < targetMonth)) &&
        (endYear > targetYear || (endYear === targetYear && endMonth > targetMonth));
      
      // 현재 월에 이벤트가 있는지
      if (!startInCurrentMonth && !endInCurrentMonth && !spanningCurrentMonth) {
        return false;
      }
      
      // 해당 날짜가 이벤트 범위 내에 있는지
      if (startInCurrentMonth && endInCurrentMonth) {
        // 같은 월 내에서 시작하고 끝남
        return day >= startDay && day <= endDay;
      } else if (spanningCurrentMonth) {
        // 이전 월에 시작해서 다음 월에 끝남
        return true;
      } else if (startInCurrentMonth) {
        // 현재 월에 시작
        return day >= startDay;
      } else if (endInCurrentMonth) {
        // 현재 월에 끝남
        return day <= endDay;
      }
      
      return false;
    });
    
    return filteredEvents;
  }

  // 완료율에 따른 배경색 스타일
  function getCompletionStyle(completion: number): string {
    if (completion === 0) return 'var(--bg-secondary)';
    if (completion < 50) return 'rgba(125,189,182,0.1)';
    if (completion < 80) return 'rgba(125,189,182,0.2)';
    return 'linear-gradient(135deg, rgba(125,189,182,0.3), rgba(139,157,195,0.3))';
  }

  // 날짜 클릭 핸들러
  function handleDayClick(day: number | null) {
    if (day === 0 || day === null) return; // 빈 날짜는 클릭 불가
    
    const dayEvents = getEventsForDay(day);
    selectedDayEvents = dayEvents;
    selectedDay = day;
    showPopup = dayEvents.length > 0; // 이벤트가 있을 때만 팝업 표시
    dispatch('daySelected', { day, events: dayEvents });
  }

  // monthData를 이벤트 정보와 함께 가공
  $: monthDataWithEvents = monthData.map((week, weekIdx) =>
    week.map((day, dayIdx) => {
      // 0이나 null은 빈 날짜를 의미
      if (day === 0 || day === null) return null;
      
      return {
        day: day as number, // 타입 단언: 이미 null 체크를 했으므로 number임
        dayEvents: getEventsForDay(day),
        completion: completionData[day] || 0,
        isSunday: dayIdx === 0,
        isSaturday: dayIdx === 6
      };
    })
  );
</script>

<div class="calendar-card">
  <div class="weekdays">
    {#each ['일','월','화','수','목','금','토'] as dayName, idx}
      <div class="weekday" class:sunday={idx===0} class:saturday={idx===6}>
        {dayName}
      </div>
    {/each}
  </div>

  <div class="calendar-grid">
    {#each monthDataWithEvents as week}
      <div class="calendar-row">
        {#each week as dayObj}
          <div class="calendar-cell">
            {#if dayObj}
              <div 
                class="day-cell"
                class:has-events={dayObj.dayEvents.length > 0}
                style="background: {getCompletionStyle(dayObj.completion)}"
                on:click={() => handleDayClick(dayObj.day)}
                on:keydown={(e) => e.key === 'Enter' && handleDayClick(dayObj.day)}
                role="button"
                tabindex="0"
              >
                <span 
                  class="day-number"
                  class:sunday={dayObj.isSunday}
                  class:saturday={dayObj.isSaturday}
                >
                  {dayObj.day}
                </span>

                {#if dayObj.dayEvents.length > 0}
                  <div class="day-events">
                    {#each dayObj.dayEvents.slice(0, 2) as event}
                      <div class="event-item" title={event.title}>
                        <span class="event-emoji">{event.emoji}</span>
                        <span class="event-title">{event.title}</span>
                      </div>
                    {/each}
                    {#if dayObj.dayEvents.length > 2}
                      <div class="more-events">+{dayObj.dayEvents.length - 2}개</div>
                    {/if}
                  </div>
                {/if}
              </div>
            {:else}
              <!-- 빈 날짜 셀 -->
              <div class="empty-cell"></div>
            {/if}
          </div>
        {/each}
      </div>
    {/each}
  </div>

  {#if showPopup && selectedDayEvents.length > 0}
    <div 
      class="popup-overlay" 
      on:click={() => showPopup = false}
      on:keydown={(e) => e.key === 'Escape' && (showPopup = false)}
      role="button"
      tabindex="-1"
    >
      <div 
        class="popup-content" 
        on:click|stopPropagation
        on:keydown|stopPropagation
        role="dialog"
      >
        <h3>{selectedDay}일의 일정</h3>
        <div class="popup-events">
          {#each selectedDayEvents as event (event.eventId)}
            <PlanCard {event} />
          {/each}
        </div>
        <button class="close-btn" on:click={() => showPopup = false}>닫기</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .calendar-card {
    background: var(--bg-primary);
    border-radius: 1rem;
    padding: 1rem;
    box-shadow: var(--shadow-sm);
  }

  .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-size: 0.85rem;
    font-weight: 600;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--bg-secondary);
    margin-bottom: 0.5rem;
  }

  .weekday.sunday {
    color: #ff6b6b;
  }

  .weekday.saturday {
    color: #4dabf7;
  }

  .calendar-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .calendar-row {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.5rem;
  }

  .calendar-cell {
    aspect-ratio: 1;
    min-height: 80px;
  }

  .empty-cell {
    background: transparent;
  }

  .day-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    border-radius: 0.5rem;
    padding: 0.5rem 0.25rem;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    height: 100%;
    overflow: hidden;
  }

  .day-cell:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .day-cell.has-events {
    border: 1px solid rgba(125,189,182,0.3);
  }

  .day-number {
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }

  .day-number.sunday {
    color: #ff6b6b;
  }

  .day-number.saturday {
    color: #4dabf7;
  }

  .day-events {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    width: 100%;
    font-size: 0.7rem;
  }

  .event-item {
    display: flex;
    align-items: center;
    gap: 0.15rem;
    padding: 0.15rem;
    background: rgba(255,255,255,0.5);
    border-radius: 0.25rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .event-emoji {
    flex-shrink: 0;
    font-size: 0.8rem;
  }

  .event-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .more-events {
    text-align: center;
    font-size: 0.65rem;
    color: #666;
    padding: 0.15rem;
  }

  .popup-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
  }

  .popup-content {
    background: var(--bg-primary);
    padding: 1.5rem;
    border-radius: 1rem;
    max-width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  }

  .popup-content h3 {
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
  }

  .popup-events {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .close-btn {
    width: 100%;
    padding: 0.75rem;
    background: var(--accent-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
  }

  .close-btn:hover {
    opacity: 0.9;
  }
</style>