<script lang="ts">
  import PlanCard from '$lib/components/common/plan/PlanCard.svelte';
  import type { CalendarEvent } from '$lib/types/calendar';
  import { createEventDispatcher } from 'svelte';

  export let events: CalendarEvent[] = [];
  export let completionData: Record<number, number> = {};
  export let monthData: (number | null)[][] = [];

  let selectedDayEvents: CalendarEvent[] = [];
  let showPopup = false;
  const dispatch = createEventDispatcher();

  function getEventsForDay(day: number) {
    return events.filter(e => {
      const startDate = new Date(e.start_at);
      const endDate = new Date(e.end_at);
      return (
        day >= startDate.getDate() &&
        day <= endDate.getDate()
      );
    });
  }

  function getCompletionStyle(completion: number) {
    if (completion === 0) return 'var(--bg-secondary)';
    if (completion < 50) return 'rgba(125,189,182,0.1)';
    if (completion < 80) return 'rgba(125,189,182,0.2)';
    return 'linear-gradient(135deg, rgba(125,189,182,0.3), rgba(139,157,195,0.3))';
  }

  function handleDayClick(day: number) {
    const dayEvents = getEventsForDay(day);
    selectedDayEvents = dayEvents;
    showPopup = true;
    dispatch('daySelected', { day, events: dayEvents });
  }

  $: monthDataWithEvents = monthData.map((week, wIdx) =>
    week.map((day, dIdx) => {
      if (day === null) return null;
      return {
        day,
        dayEvents: getEventsForDay(day),
        completion: completionData[day] || 0,
        isSunday: dIdx === 0,
        isSaturday: dIdx === 6
      };
    })
  );
</script>

<div class="calendar-card">
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
                <span class="day-number"
                      class:sunday={dayObj.isSunday}
                      class:saturday={dayObj.isSaturday}>
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
  .calendar-card { background: var(--bg-primary); border-radius: 1rem; padding: 1rem; box-shadow: var(--shadow-sm); }
  .weekdays { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 0.8rem; }
  .calendar-grid { display: flex; flex-direction: column; gap: 0.5rem; }
  .calendar-row { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; }
  .calendar-cell { aspect-ratio: 1; }
  .day-cell { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; border-radius: 0.5rem; padding-top: 0.25rem; cursor: pointer; transition: transform 0.2s; }
  .day-cell:hover { transform: scale(1.05); }
  .day-number { font-size: 0.9rem; font-weight: 600; margin-bottom: 0.25rem; }
  .popup-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:100; }
  .popup-content { background: var(--bg-primary); padding: 1rem; border-radius: 0.5rem; max-height: 80vh; overflow-y: auto; }
</style>
