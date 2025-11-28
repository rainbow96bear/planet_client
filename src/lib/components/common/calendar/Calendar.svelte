<script lang="ts">
  import PlanCard from '$lib/components/common/plan/PlanCard.svelte';
  import type { CalendarEvent, CalendarDayEvent, MonthData, MonthDataWithEventsMatrix } from '$lib/types/calendar';
  import { createEventDispatcher } from 'svelte';
  import styles from './Calendar.module.css';
  // Calendar 관련 유틸리티 함수는 그대로 사용
  import { getCurrentYearMonth, generateMonthData, precomputeEventsByDate, mapMonthDataWithEvents, getCompletionStyle } from './Calendar';

  export let events: CalendarDayEvent[] = [];
  export let completionData: Record<number, number> = {};
  export let monthData: MonthData = [];
  export let year: number | undefined;
  export let month: number | undefined;

  const dispatch = createEventDispatcher();

  $: ({ year: currentYear, month: currentMonth } = getCurrentYearMonth(year, month));
  // monthData prop이 제공되지 않으면 생성 함수 사용
  $: effectiveMonthData = monthData.length > 0 ? monthData : generateMonthData(currentYear, currentMonth);
  // 성능 최적화를 위해 이벤트 맵 사전 계산
  $: eventsByDateMap = precomputeEventsByDate(events, currentYear, currentMonth);

  let monthDataWithEvents: MonthDataWithEventsMatrix;
  // 월 데이터와 이벤트 데이터를 결합하여 캘린더 매트릭스 생성
  $: monthDataWithEvents = mapMonthDataWithEvents(
    effectiveMonthData,
    events,
    completionData,
    currentYear,
    currentMonth,
    eventsByDateMap
  );

  let selectedDayEvents: CalendarDayEvent[] = [];
  let selectedDay: number | null = null;
  let showDayPopup = false;

  async function handleDayClick(day: number | null, dayEvents: CalendarDayEvent[]) {
    if (!day) return;

    selectedDay = day;
    // 이전에 precomputeEventsByDate에서 CalendarEvent[]를 가져왔지만,
    // mapMonthDataWithEvents 결과물에서 dayEvents를 직접 사용하면 로직이 간결해집니다.
    // 현재 mapMonthDataWithEvents 결과인 dayEvents에는 todos가 없으므로,
    // 기존 로직을 유지하면서 CalendarDayEvent 타입에 맞게 매핑했습니다.
    selectedDayEvents = dayEvents.map(ev => ({ ...ev, todos: [] }));
    
    // 이전에 eventsByDateMap에서 가져온 로직을 아래와 같이 수정했습니다.
    // const eventsOfDay = eventsByDateMap[day] ?? [];
    // selectedDayEvents = eventsOfDay.map(ev => ({ ...ev, todos: [] }));

    showDayPopup = selectedDayEvents.length > 0;

    dispatch('daySelected', { day, events: selectedDayEvents });
  }
  
  // on:click 핸들러에 전달되는 dayObj의 dayEvents를 인자로 추가
  function wrappedHandleDayClick(dayObj: (typeof monthDataWithEvents)[0][0] & { day: number } | null) {
    if (dayObj) {
      handleDayClick(dayObj.day, dayObj.dayEvents as CalendarDayEvent[]);
    }
  }


  function onCardEdit(e: CustomEvent<CalendarEvent>) { dispatch('editEvent', e.detail); }
  function onCardDelete(e: CustomEvent<CalendarEvent>) { dispatch('requestDeleteEvent', e.detail); }
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
              <div
                class={`${styles.dayCell} ${dayObj.dayEvents.length>0?styles.hasEvents:''}`}
                style="background: {getCompletionStyle(dayObj.completion)}"
                on:click={() => wrappedHandleDayClick(dayObj)}
                on:keydown={(e) => { if(e.key === 'Enter' || e.key === ' ') wrappedHandleDayClick(dayObj); }}
                role="button"
                tabindex="0"
              >
                <span class={`${styles.dayNumber} ${dayObj.isSunday?styles.sunday:''} ${dayObj.isSaturday?styles.saturday:''}`}>
                  {dayObj.day}
                </span>
                
                {#if dayObj.dayEvents.length > 0}
                  <div class={styles.dayEvents}>
                    {#each dayObj.dayEvents.slice(0,2) as event (event.eventId)}
                      <div class={styles.eventItem} title={event.title}>
                        <span class={styles.eventEmoji}>{event.emoji}</span>
                        <span class={styles.eventTitle}>{event.title}</span>
                      </div>
                    {/each}
                    {#if dayObj.dayEvents.length > 2}
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
      <div class={styles.popupContent} on:click|stopPropagation role="dialog" aria-modal="true">
        <h3>{selectedDay}일의 일정</h3>
        <div class={styles.popupEvents}>
          {#each selectedDayEvents as event (event.eventId)}
            <PlanCard {event} isOwner={true}
                      on:edit={onCardEdit} on:delete={onCardDelete}/>
          {/each}
        </div>
        <button class={styles.closeBtn} on:click={() => { showDayPopup=false; selectedDay=null; }}>닫기</button>
      </div>
    </div>
  {/if}
</div>