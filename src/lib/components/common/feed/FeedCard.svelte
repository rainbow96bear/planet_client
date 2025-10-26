<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';

  export let feed: any; // 필요하면 타입을 공통으로 맞출 수도 있음
  const dispatch = createEventDispatcher();

  function goToProfile(handle: string) {
    goto(`/profile/${handle?.replace('@', '')}`);
  }

  function handleAction(action: string) {
    dispatch(action, { feedId: feed.id });
  }

  // todos가 문자열 배열이면 객체 형태로 변환
  $: todos = feed.todos.map(todo =>
    typeof todo === 'string'
      ? { text: todo, completed: false }
      : todo
  );

  // user 객체가 없는 경우 기본값
  $: user = feed.user || { name: '익명', handle: '', avatar: '👤' };
</script>

<article class="feed-card">
  <div class="feed-header">
    <button class="user-info" on:click={() => goToProfile(user.handle)}>
      <div class="user-avatar">{user.avatar}</div>
      <div class="user-details">
        <div class="user-name">{user.name}</div>
        <div class="user-meta">
          {#if user.handle}
            <span class="user-handle">{user.handle}</span>
            <span class="dot">•</span>
          {/if}
          <span class="post-time">{feed.date}</span>
        </div>
      </div>
    </button>
    <button class="more-btn" on:click={() => handleAction('more')} title="더보기">⋯</button>
  </div>

  <div class="feed-content">
    <div class="feed-title">
      <span class="title-emoji">{feed.emoji}</span>
      <h2>{feed.title}</h2>
    </div>

    <div class="todo-list">
      {#each todos as todo}
        <div class="todo-item" class:completed={todo.completed}>
          <div class="todo-checkbox">
            {#if todo.completed}
              <div class="checkbox-checked">✓</div>
            {:else}
              <div class="checkbox-unchecked"></div>
            {/if}
          </div>
          <span class="todo-text">{todo.text}</span>
        </div>
      {/each}
    </div>

    {#if feed.image}
      <div class="feed-image">
        <div class="image-decoration decoration-1"></div>
        <div class="image-decoration decoration-2"></div>
        <div class="image-decoration decoration-3"></div>
        <div class="image-emoji">{feed.emoji}</div>
      </div>
    {/if}
  </div>

  <div class="feed-actions">
    <button class="action-btn" class:liked={feed.isLiked} on:click={() => handleAction('like')}>
      <span class="action-icon">{feed.isLiked ? '❤️' : '🤍'}</span>
      <span class="action-count">{feed.likes}</span>
    </button>

    <button class="action-btn" on:click={() => handleAction('comment')}>
      <span class="action-icon">💬</span>
      <span class="action-count">{feed.comments}</span>
    </button>

    <button class="action-btn" on:click={() => handleAction('bookmark')}>
      <span class="action-icon">🔖</span>
    </button>

    <button class="action-btn" on:click={() => handleAction('share')}>
      <span class="action-icon">📤</span>
    </button>
  </div>
</article>

<style>
  .feed-card {
    background: var(--bg-primary);
    border-radius: 1.25rem;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
    overflow: hidden;
    transition: all 0.2s;
  }

  .feed-card:hover {
    box-shadow: var(--shadow-md);
  }

  /* 피드 헤더 */
  .feed-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 1rem 1rem 0.5rem 1rem;
  }

  .user-info {
    display: flex;
    gap: 0.75rem;
    border: none;
    background: none;
    cursor: pointer;
    text-align: left;
    padding: 0;
    transition: opacity 0.2s;
  }

  .user-info:hover {
    opacity: 0.8;
  }

  .user-avatar {
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .user-details {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .user-name {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .user-meta {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.8125rem;
    color: var(--text-secondary);
  }

  .dot {
    opacity: 0.5;
  }

  .more-btn {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: none;
    background: none;
    color: var(--text-tertiary);
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .more-btn:hover {
    background: var(--bg-secondary);
  }

  /* 피드 콘텐츠 */
  .feed-content {
    padding: 0 1rem 1rem 1rem;
  }

  .feed-title {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }

  .title-emoji {
    font-size: 1.25rem;
  }

  .feed-title h2 {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }

  /* Todo 리스트 */
  .todo-list {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    margin-bottom: 1rem;
  }

  .todo-item {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
  }

  .todo-checkbox {
    margin-top: 0.125rem;
    flex-shrink: 0;
  }

  .checkbox-checked {
    width: 1.125rem;
    height: 1.125rem;
    border-radius: 0.25rem;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: bold;
  }

  .checkbox-unchecked {
    width: 1.125rem;
    height: 1.125rem;
    border-radius: 0.25rem;
    border: 2px solid var(--border-light);
  }

  .todo-text {
    font-size: 0.9375rem;
    color: var(--text-primary);
    line-height: 1.4;
  }

  .todo-text.completed {
    color: var(--text-secondary);
    text-decoration: line-through;
  }

  /* 피드 이미지 */
  .feed-image {
    height: 16rem;
    border-radius: 0.75rem;
    background: linear-gradient(135deg, rgba(125,189,182,0.1), rgba(139,157,195,0.1), rgba(184,164,201,0.1));
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .image-decoration {
    position: absolute;
    border-radius: 50%;
    filter: blur(50px);
  }

  .decoration-1 {
    top: 2rem;
    left: 2rem;
    width: 5rem;
    height: 5rem;
    background: rgba(255, 255, 255, 0.3);
  }

  .decoration-2 {
    bottom: 2rem;
    right: 3rem;
    width: 7rem;
    height: 7rem;
    background: rgba(255, 255, 255, 0.2);
  }

  .decoration-3 {
    top: 50%;
    right: 2rem;
    width: 4rem;
    height: 4rem;
    background: rgba(255, 255, 255, 0.25);
  }

  .image-emoji {
    font-size: 5rem;
    position: relative;
    z-index: 10;
  }

  /* 피드 액션 */
  .feed-actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.75rem 1rem;
    border-top: 1px solid var(--border-light);
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    border: none;
    background: none;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
  }

  .action-btn:hover {
    background: var(--bg-secondary);
  }

  .action-btn.liked {
    color: var(--color-primary);
  }

  .action-icon {
    font-size: 1.125rem;
  }

  .action-count {
    font-size: 0.875rem;
    font-weight: 500;
  }
</style>