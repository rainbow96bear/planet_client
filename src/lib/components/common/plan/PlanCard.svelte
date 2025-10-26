<script lang="ts">
  export let event: { id: number; title: string; start: number; end: number; visibility: string; emoji: string };
</script>

<div class="plan-card">
  <div class="plan-content">
    <span class="plan-emoji">{event.emoji}</span>
    <div class="plan-info">
      <div class="plan-title">{event.title}</div>
      <div class="plan-date">
        {event.start === event.end 
          ? `${event.start}일` 
          : `${event.start}일 - ${event.end}일 (${event.end - event.start + 1}일간)` }
      </div>
    </div>
  </div>
  <div class="plan-visibility">
    {#if event.visibility === 'public'}🌍{:else if event.visibility === 'friends'}👥{:else}🔒{/if}
  </div>
</div>

<style>
.plan-card {
  background: var(--bg-primary);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: all 0.2s;
}

.plan-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}

.plan-content {
  display: flex;
  gap: 0.75rem;
  flex: 1;
}

.plan-emoji {
  font-size: 1.5rem;
}

.plan-info {
  flex: 1;
}

.plan-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.plan-date {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-primary);
}

.plan-visibility {
  font-size: 0.875rem;
}
</style>
