<script lang="ts">
  import { onMount } from 'svelte';
  import type { CalendarDayEvent, Todo, CalendarEvent } from '$lib/types/calendar';
  import { createEventDispatcher, getContext } from 'svelte';
  import styles from './PlanCard.module.css';
  import { get } from 'svelte/store';
  import { auth, user } from '$lib/stores';
  import { goto } from '$app/navigation';
  import { apiFetch } from '$lib/client/apiFetch';

  export let year: number;
  export let month: number;
  export let day: number | null;
  export let nickname: string;

  const dispatch = createEventDispatcher();

  const userData = get(user);
  $: isOwner = userData?.nickname === nickname;

  let loading = true;
  let error: string | null = null;
  let dailyPlans: CalendarDayEvent[] = [];

  // -------------------- 데이터 로드 --------------------
  async function loadDailyPlans(y: number, m: number, d: number) {
    if (!d) {
      dailyPlans = [];
      loading = false;
      return;
    }

    loading = true;
    error = null;

    try {
      const dateString = `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      let url = isOwner ? `/api/me/plans/daily` : `/api/users/${nickname}/plans/daily`;
      url += `?date=${dateString}`;

      // 💡 토큰은 /api/me 경로일 때만 전달
      const token = isOwner ? get(auth).accessToken : undefined;
      const res = await apiFetch(url, { accessToken: token });

      if (res.ok) {
        const data = await res.json();
        dailyPlans = data.dailyPlans || [];
      } else {
        const errBody = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(errBody.message || '일일 계획 불러오기 실패');
      }
    } catch (e: any) {
      console.error('Error fetching daily plans:', e);
      error = '일일 계획을 불러오는 데 실패했습니다.';
    } finally {
      loading = false;
    }
  }

  // -------------------- onMount 및 reactive --------------------
  onMount(() => {
    if (day) loadDailyPlans(year, month, day);
  });

  // day, month, year 변경 시 재로드
  $: if (day && year && month) {
    loadDailyPlans(year, month, day);
  }

  // -------------------- Todo 상태 업데이트 --------------------
  async function toggleTodoDone(event: CalendarDayEvent, todo: Todo) {
    if (!isOwner) return;

    dailyPlans = [...dailyPlans]; // 낙관적 업데이트용 반응성 트리거

    try {
      const token = get(auth)?.accessToken;
      const res = await apiFetch(`/api/me/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_done: todo.isDone }),
        accessToken: token
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errBody.message);
      }

      dispatch('todoUpdated', { eventId: event.eventId });
    } catch (e) {
      console.error('Todo status update failed:', e);
      todo.isDone = !todo.isDone; // 롤백
      dailyPlans = [...dailyPlans];
      alert('할 일 상태 변경에 실패했습니다. 다시 시도해 주세요.');
    }
  }

  // -------------------- 헬퍼 --------------------
  const daysOfWeek = ['일','월','화','수','목','금','토'];
  function getDayOfWeek(y: number, m: number, d: number) {
    const date = new Date(y, m-1, d);
    return daysOfWeek[date.getDay()];
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()}`;
  }

  function getDateRange(startAt: string, endAt: string) {
    const start = new Date(startAt);
    const end = new Date(endAt);
    if (start.toDateString() === end.toDateString()) return formatDate(startAt);

    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000*60*60*24)) + 1;
    return `${formatDate(startAt)} - ${formatDate(endAt)} (${diffDays}일간)`;
  }

  function getVisibilityInfo(vis: string | undefined) {
    switch(vis) {
      case 'public': return { icon:'🌍', text:'전체 공개' };
      case 'friends': return { icon:'👥', text:'친구 공개' };
      default: return { icon:'🔒', text:'비공개' };
    }
  }

  function handleEdit(event: CalendarEvent) {
    goto(`/calendar/${event.eventId}/edit`);
    dispatch('closePopup');
  }

  function handleDelete(event: CalendarEvent) {
    dispatch('delete', event);
    dailyPlans = dailyPlans.filter(p => p.eventId !== event.eventId);
  }
</script>

<div class={styles.dailyPlanViewer}>
  <h3>{year}년 {month}월 {day}일 ({day ? getDayOfWeek(year, month, day) : ''}) 일정</h3>

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

            {#if todos.length > 0}
              <div class={styles.todoList}>
                <div class={styles.todoListTitle}>할 일 ({doneCount}/{todos.length})</div>
                {#each todos as todo (todo.id)}
                  <div class={styles.todoItem}>
                    {#if isOwner}
                      <input type="checkbox" bind:checked={todo.isDone} on:change={() => toggleTodoDone(event, todo)} class={styles.todoCheckbox}/>
                    {:else}
                      <span class:done={todo.isDone}>{todo.isDone ? '✅' : '➖'}</span>
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
                  <button class={styles.editButton} on:click={() => handleEdit(event)}>수정</button>
                  <button class={styles.deleteButton} on:click={() => handleDelete(event)}>삭제</button>
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
