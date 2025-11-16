<script lang="ts">
  import PlanCard from '$lib/components/common/plan/PlanCard.svelte';
  import type { CalendarEvent } from '$lib/types/calendar';
  import { createEventDispatcher } from 'svelte';
  import styles from './Calendar.module.css';

  export let events: CalendarEvent[] = [];
  export let completionData: Record<number, number> = {};
  export let monthData: (number | null)[][] = [];
  
  let selectedDayEvents: CalendarEvent[] = [];
  let selectedDay: number | null = null;
  let showPopup = false;
  const dispatch = createEventDispatcher();

  $: currentYearMonth = (() => {
    for (const week of monthData) {
      for (const day of week) {
        if (day && day > 0) {
          const date = events.length > 0 ? new Date(events[0].startAt) : new Date();
          return { year: date.getFullYear(), month: date.getMonth() + 1 };
        }
      }
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  })();

  function getEventsForDay(day: number): CalendarEvent[] {
    if (!day || !currentYearMonth) return [];

    return events.filter(event => {
      const start = new Date(event.startAt);
      const end = new Date(event.endAt);
      const { year: targetYear, month: targetMonth } = currentYearMonth;

      const startInMonth = start.getFullYear() === targetYear && (start.getMonth() + 1) === targetMonth;
      const endInMonth = end.getFullYear() === targetYear && (end.getMonth() + 1) === targetMonth;
      const spanningMonth = (start.getFullYear() < targetYear || (start.getFullYear() === targetYear && start.getMonth() + 1 < targetMonth))
                        && (end.getFullYear() > targetYear || (end.getFullYear() === targetYear && end.getMonth() + 1 > targetMonth));

      if (!startInMonth && !endInMonth && !spanningMonth) return false;

      if (startInMonth && endInMonth) return day >= start.getDate() && day <= end.getDate();
      if (spanningMonth) return true;
      if (startInMonth) return day >= start.getDate();
      if (endInMonth) return day <= end.getDate();
      return false;
    });
  }

  function getCompletionStyle(completion: number): string {
    if (completion === 0) return 'var(--bg-secondary)';
    if (completion < 50) return 'rgba(125,189,182,0.1)';
    if (completion < 80) return 'rgba(125,189,182,0.2)';
    return 'linear-gradient(135deg, rgba(125,189,182,0.3), rgba(139,157,195,0.3))';
  }

  function handleDayClick(day: number | null) {
    if (!day) return;
    selectedDayEvents = getEventsForDay(day);
    selectedDay = day;
    showPopup = selectedDayEvents.length > 0;
    console.log(selectedDayEvents)
    dispatch('daySelected', { day, events: selectedDayEvents });
  }

  // Popup용 고유 key
  $: selectedDayEventsWithKey = selectedDayEvents.map((event, idx) => ({
    ...event,
    _key: event.eventId ?? `${selectedDay}-${idx}`
  }));

  $: monthDataWithEvents = monthData.map((week) =>
    week.map((day, dayIdx) => {
      if (!day) return null;
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

<div class={styles.calendarCard}>
  <div class={styles.weekdays}>
    {#each ['일','월','화','수','목','금','토'] as dayName, idx}
      <div class={`${styles.weekday} ${idx === 0 ? styles.sunday : ''} ${idx === 6 ? styles.saturday : ''}`}>
        {dayName}
      </div>
    {/each}
  </div>

  <div class={styles.calendarGrid}>
    {#each monthDataWithEvents as week}
      <div class={styles.calendarRow}>
        {#each week as dayObj}
          <div class={styles.calendarCell}>
            {#if dayObj}
              <div
                class={`${styles.dayCell} ${dayObj.dayEvents.length > 0 ? styles.hasEvents : ''}`}
                style="background: {getCompletionStyle(dayObj.completion)}"
                on:click={() => handleDayClick(dayObj.day)}
                role="button"
                tabindex="0"
              >
                <span class={`${styles.dayNumber} ${dayObj.isSunday ? styles.sunday : ''} ${dayObj.isSaturday ? styles.saturday : ''}`}>
                  {dayObj.day}
                </span>

                {#if dayObj.dayEvents.length > 0}
                  <div class={styles.dayEvents}>
                    {#each dayObj.dayEvents.slice(0, 2) as event, idx}
                      <div class={styles.eventItem} title={event.title}>
                        <span class={styles.eventEmoji}>{event.emoji}</span>
                        <span class={styles.eventTitle}>{event.title}</span>
                      </div>
                    {/each}
                    {#if dayObj.dayEvents.length > 2}
                      <div class={styles.moreEvents}>+{dayObj.dayEvents.length - 2}개</div>
                    {/if}
                  </div>
                {/if}
              </div>
            {:else}
              <div class={styles.emptyCell}></div>
            {/if}
          </div>
        {/each}
      </div>
    {/each}
  </div>

  {#if showPopup && selectedDayEventsWithKey.length > 0}
    <div class={styles.popupOverlay} on:click={() => showPopup = false} role="button" tabindex="-1">
      <div class={styles.popupContent} on:click|stopPropagation role="dialog">
        <h3>{selectedDay}일의 일정</h3>
        <div class={styles.popupEvents}>
          {#each selectedDayEventsWithKey as event (event.eventId)}
            <PlanCard {event} isOwner={true}/>
          {/each}
        </div>
        <button class={styles.closeBtn} on:click={() => showPopup = false}>닫기</button>
      </div>
    </div>
  {/if}
</div>
