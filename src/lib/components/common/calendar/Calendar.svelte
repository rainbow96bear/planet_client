<script lang="ts">
  import PlanCard from '$lib/components/common/plan/PlanCard.svelte';

  export let events: { id: number; title: string; start: number; end: number; visibility: string; emoji: string }[] = [];
  export let monthData: (number | null)[][] = [];
  export let completionData: Record<number, number> = {};

  function getEventsForDay(day: number) {
    return events.filter(event => day >= event.start && day <= event.end);
  }

  function getEmojisForDay(day: number) {
    const dayEvents = getEventsForDay(day);
    return dayEvents.slice(0, 2).map(e => e.emoji);
  }

  function getCompletionStyle(completion: number) {
    if (completion === 0) return '#F9FAFB';
    if (completion < 50) return 'rgba(125,189,182,0.1)';
    if (completion < 80) return 'rgba(125,189,182,0.2)';
    return 'linear-gradient(135deg, rgba(125,189,182,0.3), rgba(139,157,195,0.3))';
  }
</script>

<div class="calendar-view">
  <div class="calendar-card">
    <div class="calendar-header">
      <h2 class="calendar-title">10월 2025</h2>
      <div class="calendar-subtitle">전체 활동량</div>
    </div>

    <div class="weekdays">
      {#each ['일', '월', '화', '수', '목', '금', '토'] as day, idx}
        <div class="weekday" class:sunday={idx === 0} class:saturday={idx === 6}>
          {day}
        </div>
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
                  <span class="day-number" class:sunday={isSunday} class:saturday={isSaturday}>
                    {day}
                  </span>
                  {#if emojis.length > 0}
                    <div class="day-emojis">
                      {#each emojis as emoji}
                        <span>{emoji}</span>
                      {/each}
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
.calendar-view {
  padding: 1rem 0;
}

/* 캘린더 카드 */
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
  margin-bottom: 1rem;
}

.calendar-title {
  font-size: 1.125rem;
  font-weight: bold;
  color: var(--text-primary);
  margin: 0;
}

.calendar-subtitle {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-primary);
}

/* 요일 */
.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.weekday {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.weekday.sunday {
  color: #F87171;
}

.weekday.saturday {
  color: var(--color-secondary);
}

/* 날짜 */
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
}

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
}

.day-cell:hover {
  transform: scale(1.05);
}

.day-number {
  font-size: clamp(0.75rem, 2vw, 1rem);
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.125rem;
}

.day-number.sunday {
  color: #F87171;
}

.day-number.saturday {
  color: var(--color-secondary);
}

.day-emojis {
  display: flex;
  gap: 0.125rem;
  font-size: clamp(0.75rem, 1.5vw, 1rem);
}

/* 이번 달 계획 */
.plans-section {
  margin-top: 1rem;
}

.plans-title {
  font-size: 0.875rem;
  font-weight: bold;
  color: var(--text-primary);
  margin: 0 0 0.75rem 0.25rem;
}

.plans-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
