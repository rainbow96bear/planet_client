<script lang="ts">
  // ... (이전 코드와 동일한 Import 및 로직)
  import { onMount } from 'svelte';
  import type { CalendarDayEvent, Todo, CalendarEvent } from '$lib/types/calendar';
  import { createEventDispatcher } from 'svelte';
  import styles from './PlanCard.module.css';
  import { get } from 'svelte/store';
  import { auth } from '$lib/stores';
  import { authFetch } from '$lib/utils/authFetch';
  import { goto } from '$app/navigation'; 

  // 💡 Props 변경: 단일 Event 대신 날짜 정보를 받습니다.
  export let year: number;
  export let month: number;
  export let day: number | null;
  export let nickname: string;

  const dispatch = createEventDispatcher();
  
  // 💡 내부 상태: 로딩, 오류, 이벤트 목록
  const currentAuth = get(auth);
  $: isOwner = currentAuth?.nickname === nickname;

  let loading = true;
  let error: string | null = null;
  let dailyPlans: CalendarDayEvent[] = [];
  
  // -------------------- 데이터 로딩 로직 --------------------

  async function loadDailyPlans(y: number, m: number, d: number) {
    loading = true;
    error = null;
    dailyPlans = [];

    if (!d) {
      loading = false;
      return;
    }

    try {
      // 1. API 경로 설정 (YYYY-MM-DD 포맷)
      const dateString = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      let url = isOwner ? `/api/me/plans/daily` : `/api/users/${nickname}/plans/daily`;
      url += `?date=${dateString}`;

      // 2. API 호출
      const res = await authFetch(url);
      
      if (res.ok) {
        const data = await res.json();
        dailyPlans = data.dailyPlans || [];
      } else {
        throw new Error(`Failed to fetch daily plans: ${res.statusText}`);
      }
    } catch (e) {
      console.error("Error fetching daily plans:", e);
      error = '일일 계획을 불러오는 데 실패했습니다.';
    } finally {
      loading = false;
    }
  }

  // 💡 onMount 시점에 데이터 로드
  onMount(() => {
    if (day) {
      loadDailyPlans(year, month, day);
    }
  });
  
  // 💡 reactive block: day, month, year가 바뀌면 재로딩
  $: if (day && year && month) {
    loadDailyPlans(year, month, day);
  }

  // -------------------- 이벤트 및 Todo 업데이트 로직 --------------------

  // Todo 상태 토글
  async function toggleTodoDone(event: CalendarDayEvent, todo: Todo) {
    if (!isOwner) return;

        // 💡 bind:checked={todo.isDone}에 의해 todo.isDone은 이미 새로운 값으로 변경되었습니다.
        //    이제 Svelte에게 이를 알려 UI를 갱신합니다. (낙관적 업데이트)
    dailyPlans = [...dailyPlans]; // Svelte 반응성 트리거

    try {
      // API 호출 (Todo 개별 업데이트)
      const res = await authFetch(`/api/me/todos/${todo.id}`, { 
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json' 
        },
        // 💡 현재 UI에 반영된 todo.isDone 값을 서버로 보냅니다.
        body: JSON.stringify({ is_done: todo.isDone }) 
      });
      
      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(`API request failed: ${res.status} - ${errorBody.message}`);
      }
      
      dispatch('todoUpdated', { eventId: event.eventId });
    } catch (e) {
      console.error("Todo status update failed:", e);
      
      // 💡 실패 시 롤백: 현재 상태를 이전 상태로 되돌립니다.
      todo.isDone = !todo.isDone; 
      alert('할 일 상태 변경에 실패했습니다. 다시 시도해 주세요.');
      
      // 💡 롤백된 상태를 Svelte에 알립니다.
      dailyPlans = [...dailyPlans]; 
    }
  }
  
  // 헬퍼 함수
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  
  function getDayOfWeek(y: number, m: number, d: number): string {
    // JavaScript Date 객체는 월을 0부터 시작 (0=1월, 11=12월)
    const date = new Date(y, m - 1, d);
    return daysOfWeek[date.getDay()];
  }
  
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()}`;
  }
  function getDateRange(startAt: string, endAt: string) {
    const start = new Date(startAt);
    const end = new Date(endAt);
    if (start.toDateString()===end.toDateString()) return formatDate(startAt);
    
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return `${formatDate(startAt)} - ${formatDate(endAt)} (${diffDays}일간)`;
  }
  function getVisibilityInfo(vis: string | undefined) {
    switch(vis) {
      case 'public': return { icon:'🌍', text:'전체 공개' };
      case 'friends': return { icon:'👥', text:'친구 공개' };
      default: return { icon:'🔒', text:'비공개' };
    }
  }

  // Calendar로 이벤트 전달
  function handleEdit(event: CalendarEvent) { 
    goto(`/calendar/${event.eventId}/edit`);
    dispatch('closePopup');
  }

  function handleDelete(event: CalendarEvent) { 
    dispatch('delete', event); 
    dailyPlans = dailyPlans.filter(plan => plan.eventId !== event.eventId);
  }
</script>

<div class={styles.dailyPlanViewer}>
  <h3>{year}년 {month}월 {day}일 ({day ? getDayOfWeek(year, month, day) : ''})의 일정</h3>

  {#if loading}
    <div class={styles.loading}>일정을 불러오는 중입니다...</div>
  {:else if error}
    <div class={styles.error}>{error}</div>
  {:else if dailyPlans.length === 0}
    <div class={styles.noEvents}>해당 날짜에 등록된 일정이 없습니다.</div>
  {:else}
    <div class={styles.popupEvents}>
      {#each dailyPlans as event (event.eventId)}
        {@const todos = event.todos || []}
        {@const doneCount = todos.filter(t => t.isDone).length}
        {@const visibilityInfo = getVisibilityInfo(event.visibility)}
        {@const dateRange = getDateRange(event.startAt, event.endAt)}

        <div class={styles.planCard}>
          <div class={styles.planContent}>
            <div class={styles.planHeader}>
              <span class={styles.planEmoji}>{event.emoji}</span>
              <div class={styles.planInfo}>
                <div class={styles.planTitle}>{event.title}</div>
                <div class={styles.planDate}>{dateRange}</div>
              </div>
            </div>
            
            {#if event.description}
              <div class={styles.planDescription}>{event.description}</div>
            {/if}

            {#if todos.length > 0}
              <div class={styles.todoList}>
                <div class={styles.todoListTitle}>
                  할 일 ({doneCount}/{todos.length})
                </div>
                {#each todos as todo (todo.id)} 
                  <div class={styles.todoItem}>
                    {#if isOwner}
                      <input 
                        type="checkbox" 
                        bind:checked={todo.isDone} 
                        on:change={() => toggleTodoDone(event, todo)}
                        class={styles.todoCheckbox}
                      />
                    {:else}
                      <span class={styles.todoStatusIcon} class:done={todo.isDone}>
                        {todo.isDone ? '✅' : '➖'}
                      </span>
                    {/if}
                    <span class:todoDone={todo.isDone}>{todo.content}</span>
                  </div>
                {/each}
              </div>
            {/if}

            <div class={styles.planFooter}>
              <div class={styles.planVisibility} title={visibilityInfo.text}>{visibilityInfo.icon}</div>
              {#if isOwner}
                <div class={styles.buttonGroup}>
                  <button class={styles.editButton} on:click={() => handleEdit(event)}>
                    수정
                  </button>
                  <button class={styles.deleteButton} on:click={() => handleDelete(event)}>
                    삭제
                  </button>
                </div>
              {/if}
            </div>
          </div>
        </div>
        {/each}
    </div>
  {/if}
  <button class={styles.closeBtn} on:click={() => dispatch('closePopup')}>팝업 닫기</button>
</div>