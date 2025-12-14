<script lang="ts">
  import PlanCard from '$lib/components/common/plan/PlanCard.svelte';
  import type { CalendarEvent, MonthDataWithEventsMatrix, MonthData } from '$lib/types/calendar';
  import { createEventDispatcher } from 'svelte';
  import styles from './Calendar.module.css';
  import { generateMonthData, mapMonthDataWithEvents, getCompletionStyle, precomputeEventsByDate } from './Calendar';
  import { get } from 'svelte/store';
  import { auth } from '$lib/stores';
  import { apiFetch } from '$lib/client/apiFetch';

  export let events: CalendarEvent[] = [];
  export let nickname: string;
  export let year: number|undefined;
  export let month: number|undefined;

  const dispatch = createEventDispatcher();

  // 오늘 기준
  const today = new Date();
  const currentYear: number = year ?? today.getFullYear();
  const currentMonth: number = month ?? today.getMonth() + 1;

  const monthData: MonthData = generateMonthData(currentYear, currentMonth);
  let monthDataWithEvents: MonthDataWithEventsMatrix;
  $: monthDataWithEvents = mapMonthDataWithEvents(
    monthData,
    events,
    currentYear,
    currentMonth,
    precomputeEventsByDate(events, currentYear, currentMonth)
  );

  let selectedDay: number | null = null;
  let showDayPopup = false;

  function handleDayClick(day: number | null) {
    if (!day) return;
    selectedDay = day;
    showDayPopup = true;
  }

  function wrappedHandleDayClick(dayObj: typeof monthDataWithEvents[0][0] | null) {
    if (dayObj) handleDayClick(dayObj.day);
  }

  function onCardEdit(e: CustomEvent<CalendarEvent>) {
    showDayPopup = false;
  }

  async function onCardDelete(e: CustomEvent<CalendarEvent>) {
    const event = e.detail;
    if (!confirm(`"${event.title}" 일정을 삭제할까요?`)) return;

    try {
      // 실제 API 호출 가능
      const token = get(auth)?.accessToken;
      const res = await apiFetch(
        `/api/me/calendar/events/${event.eventId}`,
        { method: 'DELETE', accessToken: token }
      );

      if (!res.ok) throw new Error('삭제 실패');

      // 로컬 배열에서 삭제
      events = events.filter(ev => ev.eventId !== event.eventId);

      showDayPopup = false;
      selectedDay = null;
      dispatch('refreshCalendar');
    } catch (err) {
      console.error(err);
      alert('삭제 실패');
    }
  }

  function onTodoUpdated() {
    dispatch('refreshCalendar');
  }
</script>

<div class={styles.calendarCard}>
  <div class={styles.weekdays}>
    {#each ['일','월','화','수','목','금','토'] as dayName, idx}
      <div class={`${styles.weekday} ${idx===0?styles.sunday:''} ${idx===6?styles.saturday:''}`}>
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
              <button
                class={`${styles.dayCell} ${dayObj.dayEvents.length>0?styles.hasEvents:''}`}
                on:click={() => wrappedHandleDayClick(dayObj)}
                tabindex="0"
              >
                <span class={`${styles.dayNumber} ${dayObj.isSunday?styles.sunday:''} ${dayObj.isSaturday?styles.saturday:''}`}>
                  {dayObj.day}
                </span>

                {#if dayObj.dayEvents.length > 0}
                  <div class={styles.dayEvents}>
                    {#each dayObj.dayEvents.slice(0,3) as event (event.eventId)}
                      <div class={styles.eventItem} title={event.title}>
                        <span class={styles.eventTitle}>{event.title}</span>
                      </div>
                    {/each}
                    {#if dayObj.dayEvents.length > 3}
                      <div class={styles.moreEvents}>+{dayObj.dayEvents.length-3}개</div>
                    {/if}
                  </div>
                {/if}
              </button>
            {:else}
              <div class={styles.emptyCell}></div>
            {/if}
          </div>
        {/each}
      </div>
    {/each}
  </div>

{#if showDayPopup}
  <div 
    class={styles.popupOverlay} 
    on:click={() => { showDayPopup=false; selectedDay=null; }} 
    on:keydown={(e) => { if(e.key === 'Escape') { showDayPopup=false; selectedDay=null; } }}
    tabindex="0"
    role="button"
  >
    <button 
      class={styles.popupContent} 
      on:click|stopPropagation 
      role="dialog" 
      aria-modal="true"
      tabindex="0">
      <PlanCard 
        year={currentYear} 
        month={currentMonth} 
        day={selectedDay}
        {nickname}
        on:edit={onCardEdit} 
        on:delete={onCardDelete}
        on:todoUpdated={onTodoUpdated} 
        on:closePopup={() => { showDayPopup=false; selectedDay=null; }}
      />
    </button>
  </div>
{/if}

</div>
