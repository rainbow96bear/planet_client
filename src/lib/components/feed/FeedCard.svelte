<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  import styles from './FeedCard.module.css';

  import type { Feed } from '$lib/stores/feed';
  import type { FeedTodo, FeedUser } from './FeedCard';

  export let feed: Feed;

  const dispatch = createEventDispatcher();

  function goToProfile(handle: string) {
    goto(`/profile/${handle.replace('@', '')}`);
  }

  function handleAction(action: string) {
    dispatch(action, { feedId: feed.id });
  }

  $: todos = feed.todos.map<FeedTodo>(todo =>
    typeof todo === 'string'
      ? { text: todo, completed: false }
      : todo
  );

  $: user: FeedUser = feed.user ?? {
    name: '익명',
    handle: '',
    avatar: '👤'
  };
</script>

<article class={styles.feedCard}>
  <div class={styles.feedHeader}>
    <button class={styles.userInfo} on:click={() => goToProfile(user.handle)}>
      <div class={styles.userAvatar}>{user.avatar}</div>

      <div class={styles.userDetails}>
        <div class={styles.userName}>{user.name}</div>
        <div class={styles.userMeta}>
          {#if user.handle}
            <span>{user.handle}</span>
            <span class={styles.dot}>•</span>
          {/if}
          <span>{feed.date}</span>
        </div>
      </div>
    </button>

    <button
      class={styles.moreBtn}
      on:click={() => handleAction('more')}
      aria-label="더보기"
    >
      ⋯
    </button>
  </div>

  <div class={styles.feedContent}>
    <div class={styles.feedTitle}>
      <span>{feed.emoji}</span>
      <h2>{feed.title}</h2>
    </div>

    <div class={styles.todoList}>
      {#each todos as todo}
        <div class={styles.todoItem}>
          <div class={styles.todoCheckbox}>
            {#if todo.completed}
              <div class={styles.checkboxChecked}>✓</div>
            {:else}
              <div class={styles.checkboxUnchecked} />
            {/if}
          </div>
          <span class:completed={todo.completed} class={styles.todoText}>
            {todo.text}
          </span>
        </div>
      {/each}
    </div>

    {#if feed.image}
      <div class={styles.feedImage}>
        <div class={styles.imageEmoji}>{feed.emoji}</div>
      </div>
    {/if}
  </div>

  <div class={styles.feedActions}>
    <button
      class={`${styles.actionBtn} ${feed.isLiked ? styles.liked : ''}`}
      on:click={() => handleAction('like')}
    >
      <span>{feed.isLiked ? '❤️' : '🤍'}</span>
      <span>{feed.likes}</span>
    </button>

    <button class={styles.actionBtn} on:click={() => handleAction('comment')}>
      💬 <span>{feed.comments}</span>
    </button>

    <button class={styles.actionBtn} on:click={() => handleAction('bookmark')}>
      🔖
    </button>

    <button class={styles.actionBtn} on:click={() => handleAction('share')}>
      📤
    </button>
  </div>
</article>
