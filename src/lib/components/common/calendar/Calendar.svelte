<script lang="ts">
  import PlanCard from '$lib/components/common/plan/PlanCard.svelte';
  import type { CalendarEvent, CalendarDayEvent } from '$lib/types/calendar';
  import { createEventDispatcher } from 'svelte';
  import styles from './Calendar.module.css';
  import {
    getCurrentYearMonth,
    generateMonthData,
    precomputeEventsByDate,
    mapMonthDataWithEvents,
    getCompletionStyle,
    type MonthData,
    type MonthDataWithEvents
  } from './Calendar.ts';

  export let events: CalendarEvent[] = [];
  export let completionData: Record<number, number> = {};
  export let monthData: MonthData = [];
  export let year?: number;
  export let month?: number;

  const dispatch = createEventDispatcher();

  $: ({ year: currentYear, month: currentMonth } = getCurrentYearMonth(year, month));
  $: effectiveMonthData = monthData.length > 0 ? monthData : generateMonthData(currentYear, currentMonth);
  $: eventsByDateMap = precomputeEventsByDate(events, currentYear, currentMonth);
  $: monthDataWithEvents = mapMonthDataWithEvents(effectiveMonthData, events, completionData, currentYear, currentMonth, eventsByDateMap);

  let selectedDayEvents: CalendarDayEvent[] = [];
  let selectedDay: number | null = null;
  let showDayPopup = false;

  async function handleDayClick(day: number | null) {
    if (!day) return;
    const eventsOfDay = eventsByDateMap[day] ?? [];
    // todos fetch (각 이벤트마다)
    const dayEventsWithTodos: CalendarDayEvent[] = await Promise.all(
      eventsOfDay.map(async (ev) => {
        try {
          const res = await fetch(`/api/todos?eventId=${ev.eventId}`);
          const todos = await res.json();
          return { ...ev, todos };
        } catch {
          return { ...ev, todos: [] };
        }
      })
    );
    selectedDayEvents = dayEventsWithTodos;
    selectedDay = day;
    showDayPopup = selectedDayEvents.length > 0;
    dispatch('daySelected', { day, events: selectedDayEvents });
  }

  function onCardEdit(e) { dispatch('editEvent', e.detail); }
  function onCardDelete(e) { dispatch('requestDeleteEvent', e.detail); }
</script>

<div class={styles.calendarCard}>
  <div class={styles.weekdays}>
    {#each ['일','월','화','수','목','금','토'] as dayName, idx}
      <div class={`${styles.weekday} ${idx===0?styles.sunday:''} ${idx===6?styles.saturday:''}`}>{dayName}</div>
    {/each}
  </div>

  <div class={styles.calendarGrid}>
    {#each monthDataWithEvents as week}
      <div class={styles.calendarRow}>
        {#each week as dayObj}
          <div class={styles.calendarCell}>
            {#if dayObj}
              <div class={`${styles.dayCell} ${dayObj.dayEvents.length>0?styles.hasEvents:''}`}
                   style="background: {getCompletionStyle(dayObj.completion)}"
                   on:click={() => handleDayClick(dayObj.day)}
                   role="button" tabindex="0">
                <span class={`${styles.dayNumber} ${dayObj.isSunday?styles.sunday:''} ${dayObj.isSaturday?styles.saturday:''}`}>
                  {dayObj.day}
                </span>
                {#if dayObj.dayEvents.length>0}
                  <div class={styles.dayEvents}>
                    {#each dayObj.dayEvents.slice(0,2) as event}
                      <div class={styles.eventItem} title={event.title}>
                        <span class={styles.eventEmoji}>{event.emoji}</span>
                        <span class={styles.eventTitle}>{event.title}</span>
                      </div>
                    {/each}
                    {#if dayObj.dayEvents.length>2}
                      <div class={styles.moreEvents}>+{dayObj.dayEvents.length-2}개</div>
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

  {#if showDayPopup}
    <div class={styles.popupOverlay} on:click={() => { showDayPopup=false; selectedDay=null; }} role="button" tabindex="-1">
      <div class={styles.popupContent} on:click|stopPropagation role="dialog">
        <h3>{selectedDay}일의 일정</h3>
        <div class={styles.popupEvents}>
          {#each selectedDayEvents as event (event.eventId)}
            <PlanCard {event} todos={event.todos} isOwner={true}
                      on:edit={onCardEdit} on:delete={onCardDelete}/>
          {/each}
        </div>
        <button class={styles.closeBtn} on:click={() => { showDayPopup=false; selectedDay=null; }}>닫기</button>
      </div>
    </div>
  {/if}
</div>
