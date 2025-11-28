<script lang="ts">
  import type { CalendarDayEvent } from '$lib/types/calendar';
  import type { Todo } from '$lib/types/todo';
  import { createEventDispatcher } from 'svelte';
  import styles from './PlanCard.module.css';

  // ✅ todos prop 제거: todos는 event 객체 안에 포함되어 있어야 합니다.
  export let event: CalendarDayEvent;
  export let isOwner: boolean = false;

  const dispatch = createEventDispatcher();

  function handleEdit() { dispatch('edit', event); }
  function handleDelete() { dispatch('delete', event); }

  async function toggleTodoDone(todo: Todo) {
    if (!isOwner) return;
    // Todo 타입에 IsDone 필드가 있는지 확인하여 사용합니다. (Go 모델 기준)
    // 현재 스크립트는 todo.Done을 사용하고 있어 일단 유지하되, 타입에 맞게 조정 필요합니다.
    const doneStatusKey = 'Done' in todo ? 'Done' : 'IsDone'; // 예비 로직
    
    // 로컬 상태 즉시 변경
    todo[doneStatusKey] = !todo[doneStatusKey];
    
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`/api/todos/${todo.ID}`, { // 🚨 주의: EventID 대신 Todo ID를 사용해야 정확합니다.
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ done: todo[doneStatusKey] })
      });
      // 성공 시: 아무것도 하지 않음 (로컬 상태 유지)
    } catch {
      // 실패 시: 상태 롤백
      todo[doneStatusKey] = !todo[doneStatusKey];
      alert('할 일 상태 변경 실패');
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()}`;
  }

  function getDateRange(startAt: string, endAt: string) {
    const start = new Date(startAt);
    const end = new Date(endAt);
    if (start.toDateString()===end.toDateString()) return formatDate(startAt);
    const diffDays = Math.ceil((end.getTime()-start.getTime())/(1000*60*60*24))+1;
    return `${formatDate(startAt)} - ${formatDate(endAt)} (${diffDays}일간)`;
  }

  function getVisibilityInfo(vis: string) {
    switch(vis) {
      case 'public': return { icon:'🌍', text:'전체 공개' };
      case 'friends': return { icon:'👥', text:'친구 공개' };
      default: return { icon:'🔒', text:'비공개' };
    }
  }

  $: visibilityInfo = getVisibilityInfo(event.visibility ?? 'private');
  $: dateRange = getDateRange(event.startAt, event.endAt);
  // Todo 배열을 event에서 직접 가져옵니다.
  $: todos = event.todos || []; // 혹시 event.todos가 null/undefined일 경우를 대비
  
  // Todo의 완료 상태 키를 Todo 모델에 맞게 조정합니다. (예: Go 모델은 IsDone)
  function isTodoDone(todo: Todo) {
      return todo['IsDone'] ?? todo['Done'] ?? false;
  }
</script>

<div class={styles.planCard}>
  <div class={styles.planContent}>
    <span class={styles.planEmoji}>{event.emoji}</span>
    <div class={styles.planInfo}>
      <div class={styles.planTitle}>{event.title}</div>
      {#if event.description}
        <div class={styles.planDescription}>{event.description}</div>
      {/if}
      <div class={styles.planDate}>{dateRange}</div>

      {#if todos.length > 0}
        <div class={styles.todoList}>
          <div class={styles.todoListTitle}>할 일 ({todos.filter(t => isTodoDone(t)).length}/{todos.length})</div>
          {#each todos as todo (todo.id)} 
            <div class={styles.todoItem}>
              {#if isOwner}
                <input 
                    type="checkbox" 
                    bind:checked={todo.isDone} 
                    on:change={() => toggleTodoDone(todo)}
                    class={styles.todoCheckbox}
                />
              {:else}
                <input 
                    type="checkbox" 
                    checked={todo.isDone} 
                    disabled
                    class={styles.todoCheckbox}
                />
              {/if}
              <span class={todo.isDone ? styles.todoDone : ''}>{todo.content}</span>
            </div>
          {/each}
        </div>
      {/if}

      {#if isOwner}
        <div class={styles.buttonGroup}>
          <button class={styles.editButton} on:click={handleEdit}>
            수정
          </button>
          <button class={styles.deleteButton} on:click={handleDelete}>
            삭제
          </button>
        </div>
      {/if}
    </div>
  </div>

  <div class={styles.planVisibility} title={visibilityInfo.text}>{visibilityInfo.icon}</div>
</div>