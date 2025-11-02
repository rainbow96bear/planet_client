<script lang="ts">
  import PlanCard from '$lib/components/common/plan/PlanCard.svelte';
  import { onMount } from 'svelte';

  export let events: { id: number; title: string; start: number; end: number; visibility: string; emoji: string }[] = [];
  export let completionData: Record<number, number> = {};

  let currentYear: number;
  let currentMonth: number; // 1~12
  let monthData: (number | null)[][] = [];

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
    return events.filter(e => day >= e.start && day <= e.end);
  }

  function getEmojisForDay(day: number) {
    const dayEvents = getEventsForDay(day);
    return dayEvents.slice(0, 2).map(e => e.emoji);
  }

  function getCompletionStyle(completion: number) {
    if (completion === 0) return 'var(--bg-secondary)';
    if (completion < 50) return 'rgba(125,189,182,0.1)';
    if (completion < 80) return 'rgba(125,189,182,0.2)';
    return 'linear-gradient(135deg, rgba(125,189,182,0.3), rgba(139,157,195,0.3))';
  }
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
      {#each monthData as week}
        <div class="calendar-row">
          {#each week as day, dayIdx}
            <div class="calendar-cell">
              {#if day}
                {@const emojis = getEmojisForDay(day)}
                {@const completion = completionData[day] || 0}
                {@const isSunday = dayIdx === 0}
                {@const isSaturday = dayIdx === 6}
                <div class="day-cell" style="background: {getCompletionStyle(completion)}">
                  <span class="day-number" class:sunday={isSunday} class:saturday={isSaturday}>{day}</span>
                  {#if emojis.length > 0}
                    <div class="day-emojis">
                      {#each emojis as emoji}<span>{emoji}</span>{/each}
                      {#if getEventsForDay(day).length > 2}<span>...</span>{/if}
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

  <div class="plans-section">
    <h3 class="plans-title">이번 달 계획</h3>
    <div class="plans-list">
      {#each events as event}
        <PlanCard {event} />
      {/each}
    </div>
  </div>
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
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  color: var(--text-primary);
}
.day-cell:hover { transform: scale(1.05); }

.day-number { font-size: clamp(0.75rem, 2vw, 1rem); font-weight: 500; color: var(--text-primary); margin-bottom: 0.125rem; }
.day-number.sunday { color: #F87171; }
.day-number.saturday { color: var(--color-secondary); }

.day-emojis {
  display: flex;
  gap: 0.125rem;
  font-size: clamp(0.75rem, 1.5vw, 1rem);
  color: var(--text-primary);
}

/* 이번 달 계획 */
.plans-section { margin-top: 1rem; }
.plans-title { font-size: 0.875rem; font-weight: bold; color: var(--text-primary); margin: 0 0 0.75rem 0.25rem; }
.plans-list { display: flex; flex-direction: column; gap: 0.5rem; }
</style>
