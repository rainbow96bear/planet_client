<script lang="ts">
 import PlanCard from '$lib/components/common/plan/PlanCard.svelte';
 import type { CalendarEvent, MonthData, MonthDataWithEventsMatrix } from '$lib/types/calendar';
 import { createEventDispatcher } from 'svelte';
 import styles from './Calendar.module.css';
 import { getCurrentYearMonth, generateMonthData, precomputeEventsByDate, mapMonthDataWithEvents, getCompletionStyle } from './Calendar';
 import { authFetch } from '$lib/utils/authFetch'; // 💡 [추가] API 호출을 위해 임포트

 export let events: CalendarEvent[] = []; 
 export let completionData: Record<number, number> = {};
 export let monthData: MonthData = [];
 export let year: number | undefined;
 export let month: number | undefined;
 export let nickname: string; // 💡 팝업 컴포넌트에 전달하기 위해 nickname props 추가
 const dispatch = createEventDispatcher();
 $: ({ year: currentYear, month: currentMonth } = getCurrentYearMonth(year, month));
 $: effectiveMonthData = monthData.length > 0 ? monthData : generateMonthData(currentYear, currentMonth);
 
 // 💡 CalendarDayEvent[] 대신 CalendarEvent[]를 사용하여 eventsByDateMap 생성
 $: eventsByDateMap = precomputeEventsByDate(events, currentYear, currentMonth);

 let monthDataWithEvents: MonthDataWithEventsMatrix;
 $: monthDataWithEvents = mapMonthDataWithEvents(
  effectiveMonthData,
  events,
  completionData,
  currentYear,
  currentMonth,
  eventsByDateMap
 );

 // 💡 selectedDayEvents 제거
 let selectedDay: number | null = null;
 let showDayPopup = false;

 // 💡 API 호출 로직 제거, 날짜 정보만 저장하고 팝업을 띄웁니다.
 function handleDayClick(day: number | null) {
  if (!day) return;

  selectedDay = day;
  showDayPopup = true;
 }
 
 function wrappedHandleDayClick(dayObj: (typeof monthDataWithEvents)[0][0] & { day: number } | null) {
  if (dayObj) {
   handleDayClick(dayObj.day); 
  }
 }

 // 💡 PlanCard에서 전파된 이벤트 처리 (수정, 삭제, Todo 업데이트)
 function onCardEdit(e: CustomEvent<CalendarEvent>) { 
  // PlanCard에서 이미 페이지 이동을 처리했으므로, 팝업만 닫습니다.
  showDayPopup = false;
 }
 
 async function onCardDelete(e: CustomEvent<CalendarEvent>) { 
    const event = e.detail;
    
    if (!confirm(`[${event.title}] 일정을 정말 삭제하시겠습니까?\n삭제된 일정은 복구할 수 없습니다.`)) {
        return;
    }

    try {
        // 💡 API 호출: 일정 삭제
        const res = await authFetch(`/api/me/calendar/events/${event.eventId}`, { 
            method: 'DELETE'
        });

        if (res.ok) {
            // ✅ [개선된 로직] 1. Svelte의 반응성을 이용해 로컬 events prop에서 삭제된 이벤트를 즉시 제거합니다.
            // 이 변경은 eventsByDateMap과 monthDataWithEvents를 자동으로 다시 계산하게 만듭니다.
            events = events.filter(ev => ev.eventId !== event.eventId); 
            
            // 💡 2. 팝업을 닫고 선택된 날짜를 초기화합니다.
            showDayPopup = false;
            selectedDay = null;

            // 3. 캘린더 전체 갱신 요청 (다른 월 등 광범위한 데이터 재로드를 위한 안전 장치)
            dispatch('refreshCalendar');
        } else {
            // API 오류 처리
            const errorData = await res.json().catch(() => ({ error: '알 수 없는 오류' }));
            throw new Error(`Failed to delete event: ${errorData.error || res.statusText}`);
        }
    } catch (error) {
        console.error("Event deletion failed:", error);
        alert("일정 삭제에 실패했습니다."); // 사용자에게 실패를 알림
    }
}

 function onTodoUpdated() {
  // Todo가 업데이트되면 상위 컴포넌트에 캘린더 전체 갱신을 요청합니다.
  dispatch('refreshCalendar');
  // Note: 팝업을 닫을지는 UX 정책에 따라 결정합니다. 여기서는 닫지 않습니다.
 }
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
        style={`background-color: ${getCompletionStyle(dayObj.completion)};`}
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
  <div 
   class={styles.popupOverlay} 
   on:click={() => { showDayPopup=false; selectedDay=null; }} 
   on:keydown={(e) => { if(e.key === 'Escape') { showDayPopup=false; selectedDay=null; }}}
   role="button" 
   tabindex="-1"
  >
   <div class={styles.popupContent} on:click|stopPropagation role="dialog" aria-modal="true">
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
   </div>
  </div>
 {/if}
</div>