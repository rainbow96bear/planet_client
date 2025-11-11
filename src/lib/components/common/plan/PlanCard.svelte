<script lang="ts">
  import type { CalendarEvent } from '$lib/types/calendar';

  export let event: CalendarEvent;

  // 날짜 포맷 함수
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}.${month}.${day}`;
  }

  // 날짜 범위 계산
  function getDateRange(startAt: string, endAt: string): string {
    const start = new Date(startAt);
    const end = new Date(endAt);
    
    const startDay = start.getDate();
    const endDay = end.getDate();
    
    // 같은 날짜인 경우
    if (start.toDateString() === end.toDateString()) {
      return `${formatDate(startAt)}`;
    }
    
    // 다른 날짜인 경우
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return `${formatDate(startAt)} - ${formatDate(endAt)} (${diffDays}일간)`;
  }

  // visibility 아이콘 및 텍스트
  function getVisibilityInfo(visibility: string): { icon: string; text: string } {
    switch (visibility) {
      case 'public':
        return { icon: '🌍', text: '전체 공개' };
      case 'friends':
        return { icon: '👥', text: '친구 공개' };
      case 'private':
      default:
        return { icon: '🔒', text: '비공개' };
    }
  }

  $: visibilityInfo = getVisibilityInfo(event.visibility);
  $: dateRange = getDateRange(event.start_at, event.end_at);
</script>

<div class="plan-card">
  <div class="plan-content">
    <span class="plan-emoji">{event.emoji}</span>
    <div class="plan-info">
      <div class="plan-title">{event.title}</div>
      {#if event.description}
        <div class="plan-description">{event.description}</div>
      {/if}
      <div class="plan-date">{dateRange}</div>
    </div>
  </div>
  <div class="plan-visibility" title={visibilityInfo.text}>
    {visibilityInfo.icon}
  </div>
</div>

<style>
  .plan-card {
    background: var(--bg-primary);
    border-radius: 0.75rem;
    padding: 1rem;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.75rem;
    transition: all 0.2s;
  }

  .plan-card:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--color-primary);
    transform: translateY(-2px);
  }

  .plan-content {
    display: flex;
    gap: 0.75rem;
    flex: 1;
    min-width: 0; /* 텍스트 overflow 처리를 위해 필요 */
  }

  .plan-emoji {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .plan-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .plan-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-primary);
    line-height: 1.4;
  }

  .plan-description {
    font-size: 0.8rem;
    color: var(--text-secondary);
    line-height: 1.4;
    margin-top: 0.25rem;
  }

  .plan-date {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--color-primary);
    margin-top: 0.25rem;
  }

  .plan-visibility {
    font-size: 1rem;
    flex-shrink: 0;
    cursor: help;
  }
</style>