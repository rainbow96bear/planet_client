<script lang="ts">
  import type { CalendarEvent } from '$lib/types/calendar';
  import { createEventDispatcher } from 'svelte';
  import styles from './PlanCard.module.css';

  export let event: CalendarEvent;
  export let isOwner: boolean = false;

  const dispatch = createEventDispatcher();

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  }

  function getDateRange(startAt: string, endAt: string) {
    const start = new Date(startAt);
    const end = new Date(endAt);
    if (start.toDateString() === end.toDateString()) return formatDate(startAt);

    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000*60*60*24)) + 1;
    return `${formatDate(startAt)} - ${formatDate(endAt)} (${diffDays}일간)`;
  }

  function getVisibilityInfo(visibility: string) {
    switch (visibility) {
      case 'public': return { icon: '🌍', text: '전체 공개' };
      case 'friends': return { icon: '👥', text: '친구 공개' };
      default: return { icon: '🔒', text: '비공개' };
    }
  }

  $: visibilityInfo = getVisibilityInfo(event.visibility);
  $: dateRange = getDateRange(event.startAt, event.endAt);

  function handleEdit() { dispatch('edit', event); }
  function handleDelete() { dispatch('delete', event); }
  function handleView() { dispatch('view', event); }
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
      <div class={styles.buttonGroup}>
        {#if isOwner}
          <button class={styles.button} on:click={handleEdit}>수정</button>
          <button class={styles.button} on:click={handleDelete}>삭제</button>
        {:else}
          <button class={styles.button} on:click={handleView}>상세보기</button>
        {/if}
      </div>
    </div>
  </div>
  <div class={styles.planVisibility} title={visibilityInfo.text}>
    {visibilityInfo.icon}
  </div>
</div>
