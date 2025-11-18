<script lang="ts">
  import type { CalendarDayEvent } from '$lib/types/calendar';
  import type { Todo } from '$lib/types/todo';
  import { createEventDispatcher } from 'svelte';
  import styles from './PlanCard.module.css';

  export let event: CalendarDayEvent;
  export let todos: Todo[] = [];
  export let isOwner: boolean = false;

  const dispatch = createEventDispatcher();

  function handleEdit() { dispatch('edit', event); }
  function handleDelete() { dispatch('delete', event); }

  async function toggleTodoDone(todo: Todo) {
    if (!isOwner) return;
    todo.Done = !todo.Done;
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`/api/todos/${todo.EventID}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ done: todo.Done })
      });
    } catch {
      todo.Done = !todo.Done;
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
</script>

<div class={styles.planCard}>
  <div class={styles.planContent}>
    <span class={styles.planEmoji}>{event.emoji}</span>
    <div class={styles.planInfo}>
      <div class={styles.planTitle}>{event.title}</div>
      {#if event.description}<div class={styles.planDescription}>{event.description}</div>{/if}
      <div class={styles.planDate}>{dateRange}</div>

      {#if todos.length>0}
        <div class={styles.todoList}>
          {#each todos as todo (todo.EventID)}
            <div class={styles.todoItem}>
              {#if isOwner}
                <input type="checkbox" bind:checked={todo.Done} on:change={() => toggleTodoDone(todo)}/>
              {:else}
                <input type="checkbox" checked={todo.Done} disabled/>
              {/if}
              <span class={todo.Done ? styles.done : ''}>{todo.Content}</span>
            </div>
          {/each}
        </div>
      {/if}

      {#if isOwner}
        <div class={styles.buttonGroup}>
          <button class={styles.button} on:click={handleEdit}>수정</button>
          <button class={styles.button} on:click={handleDelete}>삭제</button>
        </div>
      {/if}
    </div>
  </div>

  <div class={styles.planVisibility} title={visibilityInfo.text}>{visibilityInfo.icon}</div>
</div>
