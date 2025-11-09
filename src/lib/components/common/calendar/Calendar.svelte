<script lang="ts">
  import PlanCard from '$lib/components/common/plan/PlanCard.svelte';
  import type { CalendarEvent } from '$lib/types/calendar';
  import { onMount } from 'svelte';

  export let events: CalendarEvent[] = [];
  export let completionData: Record<number, number> = {};
  export let monthData: (number | null)[][] = [];

  let currentYear: number;
  let currentMonth: number;

  // 팝업 상태
  let selectedDayEvents: CalendarEvent[] = [];
  let showPopup = false;

  onMount(() => {
    const today = new Date();
    currentYear = today.getFullYear();
    currentMonth = today.getMonth() + 1;
    updateMonthData();
  });

  function updateMonthData() {
    const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
    const lastDate = new Date(currentYear, currentMonth, 0).getDate();
    const weeks: (number | null)[][] = [];
    let week: (number | null)[] = Array(firstDay).fill(null);

    for (let day = 1; day <= lastDate; day++) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }
    if (week.length > 0) {
      week = week.concat(Array(7 - week.length).fill(null));
      weeks.push(week);
    }
    monthData = weeks;
  }

  function prevMonth() {
    if (currentMonth === 1) { currentMonth = 12; currentYear--; }
    else currentMonth--;
    updateMonthData();
  }

  function nextMonth() {
    if (currentMonth === 12) { currentMonth = 1; currentYear++; }
    else currentMonth++;
    updateMonthData();
  }

  function getEventsForDay(day: number) {
    return events.filter(e => {
      const startDate = new Date(e.start_at);
      const endDate = new Date(e.end_at);
      const isInMonth = (startDate.getMonth() + 1 === currentMonth && startDate.getFullYear() === currentYear)
                     || (endDate.getMonth() + 1 === currentMonth && endDate.getFullYear() === currentYear);
      return isInMonth && day >= startDate.getDate() && day <= endDate.getDate();
    });
  }

  function getCompletionStyle(completion: number) {
    if (completion === 0) return 'var(--bg-secondary)';
    if (completion < 50) return 'rgba(125,189,182,0.1)';
    if (completion < 80) return 'rgba(125,189,182,0.2)';
    return 'linear-gradient(135deg, rgba(125,189,182,0.3), rgba(139,157,195,0.3))';
  }

  // 선택한 날짜 클릭
  function handleDayClick(day: number) {
    const dayEvents = getEventsForDay(day);
    if (dayEvents.length > 0) {
      selectedDayEvents = dayEvents;
      showPopup = true;
    }
  }

  $: monthDataWithEvents = monthData.map(week =>
    week.map((day, dayIdx) => {
      if (day === null) return null;
      return {
        day,
        dayEvents: getEventsForDay(day),
        completion: completionData[day] || 0,
        isSunday: dayIdx === 0,
        isSaturday: dayIdx === 6
      };
    })
  );
</script>

<div class="calendar-view">
  <div class="calendar-card">
    <div class="calendar-header">
      <button class="nav-btn" on:click={prevMonth}>&lt;</button>
      <div class="calendar-title">{currentYear}년 {currentMonth}월</div>
      <button class="nav-btn" on:click={nextMonth}>&gt;</button>
    </div>

    <div class="weekdays">
      {#each ['일','월','화','수','목','금','토'] as day, idx}
        <div class="weekday" class:sunday={idx===0} class:saturday={idx===6}>{day}</div>
      {/each}
    </div>

    <div class="calendar-grid">
      {#each monthDataWithEvents as week}
        <div class="calendar-row">
          {#each week as dayObj}
            <div class="calendar-cell">
              {#if dayObj}
                <div class="day-cell"
                     style="background: {getCompletionStyle(dayObj.completion)}"
                     on:click={() => handleDayClick(dayObj.day)}>
                  <span class="day-number" class:sunday={dayObj.isSunday} class:saturday={dayObj.isSaturday}>
                    {dayObj.day}
                  </span>

                  {#if dayObj.dayEvents.length > 0}
                    <div class="day-events">
                      {#each dayObj.dayEvents.slice(0, 2) as e}
                        <div class="event-item">
                          <span class="event-emoji">{e.emoji}</span>
                          <span class="event-title">{e.title}</span>
                        </div>
                      {/each}
                      {#if dayObj.dayEvents.length > 2}
                        <div class="more-events">+{dayObj.dayEvents.length - 2}</div>
                      {/if}
                    </div>
                  {/if}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/each}
    </div>
  </div>

  {#if showPopup}
    <div class="popup-overlay" on:click={() => showPopup = false}>
      <div class="popup-content" on:click|stopPropagation>
        <h3>선택된 일정</h3>
        {#each selectedDayEvents as e}
          <PlanCard event={e} />
        {/each}
        <button on:click={() => showPopup = false}>닫기</button>
      </div>
    </div>
  {/if}
</div>

<style>
.calendar-view { padding: 1rem 0; }

.calendar-card {
  background: var(--bg-primary);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  margin-bottom: 1rem;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.nav-btn {
  border: none;
  background: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--text-primary);
}

.calendar-title { font-size: 1.125rem; font-weight: bold; color: var(--text-primary); }

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.weekday { text-align: center; font-size: 0.75rem; font-weight: 500; color: var(--text-secondary); }
.weekday.sunday { color: #F87171; }
.weekday.saturday { color: var(--color-secondary); }

.calendar-grid { display: flex; flex-direction: column; gap: 0.5rem; }
.calendar-row { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; }
.calendar-cell { aspect-ratio: 1; }

.day-cell {
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 0.25rem;
  cursor: pointer;
  transition: transform 0.2s;
  color: var(--text-primary);
}
.day-cell:hover { transform: scale(1.05); }

.day-number { font-size: clamp(0.75rem, 2vw, 1rem); font-weight: 600; margin-bottom: 0.25rem; }
.day-number.sunday { color: #F87171; }
.day-number.saturday { color: var(--color-secondary); }

.day-events {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
  font-size: clamp(0.625rem, 1.2vw, 0.75rem);
  text-align: center;
}

.event-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
}

.event-emoji { font-size: 0.9rem; }
.event-title { font-weight: 500; color: var(--text-primary); }

.more-events {
  font-size: 0.65rem;
  color: var(--text-secondary);
}

/* 팝업 스타일 */
.popup-overlay {
  position: fixed;
  top:0; left:0; right:0; bottom:0;
  background: rgba(0,0,0,0.5);
  display:flex;
  justify-content:center;
  align-items:center;
  z-index: 100;
}
.popup-content {
  background: var(--bg-primary);
  padding: 1rem;
  border-radius: 0.5rem;
  max-height: 80vh;
  overflow-y: auto;
}
.popup-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: bold;
}
.popup-content button {
  margin-top: 1rem;
  padding: 0.25rem 0.5rem;
  border:none;
  border-radius:0.25rem;
  cursor:pointer;
}
</style>
