<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';
  import styles from './CalendarForm.module.css';

  import { user, auth } from '$lib/stores';
  import { apiFetch } from '$lib/client/apiFetch';

  type Visibility = 'public' | 'friends' | 'private';

  type TodoForm = {
    id?: string;      // 수정 시만 존재
    content: string;
    isDone?: boolean;  // 수정 시만 포함
  };

  export let eventData: {
    eventId?: number;
    title?: string;
    emoji?: string;
    startAt?: string;
    endAt?: string;
    description?: string;
    visibility?: Visibility;
    todos?: TodoForm[];
  } = {};

  const dispatch = createEventDispatcher();
  const token = get(auth)?.accessToken;

  /* ---------------- state ---------------- */
  let title = eventData.title ?? '';
  let emoji = eventData.emoji ?? '📝';
  let startAt = eventData.startAt ?? '';
  let endAt = eventData.endAt ?? '';
  let description = eventData.description ?? '';
  let visibility: Visibility = eventData.visibility ?? 'public';

  let todos: TodoForm[] =
    eventData.todos?.length
      ? eventData.todos.map(t => ({ ...t }))
      : [{ content: '' }];

  let showEmojiPicker = false;

  const emojiList = [
    '📝','💼','📚','💪','🏃','🧘','🍳','🎨','🎵','✈️',
    '🏝️','🚄','🎯','💻','📷','🎮','⚽','🎬','🛒','🏠',
    '🌟','❤️','🎉','🔥','✨','🌈','🎁','📱','🎸','🍕'
  ];

  /* ---------------- todo handlers ---------------- */
  function addTodo() {
    if (todos.length >= 10) {
      alert('할 일은 최대 10개까지');
      return;
    }
    todos = [...todos, { content: '' }];
  }

  function removeTodo(index: number) {
    if (todos.length === 1) return;
    todos = todos.filter((_, i) => i !== index);
  }

  /* ---------------- submit ---------------- */
  function handleSubmit() {
    if (!title.trim()) return alert('제목 입력');
    if (!startAt || !endAt) return alert('날짜 선택');
    if (new Date(startAt) > new Date(endAt)) return alert('날짜 오류');
    
    // todos 처리: 신규 생성 시 isDone 제거, 수정 시 포함
    const todosPayload = todos
      .filter(t => t.content.trim())
      .map(t => ({
        ...(t.id && { id: t.id }),
        content: t.content,
        ...(t.isDone !== undefined && { isDone: t.isDone })
      }));


    console.log("payload : ", todosPayload)
    dispatch('submit', {
      title,
      emoji,
      startAt: toRFC3339(startAt),
      endAt: toRFC3339(endAt, true),
      description,
      visibility,
      todos: todosPayload
    });
  }

  function toRFC3339(date: string, endOfDay = false) {
    const d = new Date(date);
    if (endOfDay) d.setHours(23, 59, 59, 999);
    else d.setHours(0, 0, 0, 0);
    return d.toISOString();
  }

  /* ---------------- delete ---------------- */
  async function handleDelete() {
    if (!eventData.eventId) return;
    const nickname = $user?.nickname;
    if (!nickname) return;
    if (!confirm('정말 삭제할까요?')) return;

    const res = await apiFetch(
      `/api/me/calendar/events/${eventData.eventId}`,
      { method: 'DELETE', accessToken: token }
    );

    if (res.ok) goto(`/profile/${nickname}`);
    else alert('삭제 실패');
  }
</script>

<div class={styles.calendarFormContainer}>
  <header class={styles.formHeader}>
    <button class={styles.backBtn} on:click={() => dispatch('cancel')}>←</button>
    <h1 class={styles.formTitle}>
      {eventData.eventId ? '일정 수정' : '새 일정'}
    </h1>
    <div class={styles.headerActions}>
      {#if eventData.eventId}
        <button class={styles.deleteBtn} on:click={handleDelete}>삭제</button>
      {/if}
      <button class={styles.saveBtn} on:click={handleSubmit}>완료</button>
    </div>
  </header>

  <main class={styles.formContent}>
    <!-- 제목 + 이모지 -->
    <div class={styles.section}>
      <div class={styles.emojiTitleGroup}>
        <button class={styles.emojiBtn} on:click={() => showEmojiPicker = !showEmojiPicker}>{emoji}</button>
        <input class={styles.titleInput} bind:value={title} maxlength="50" />
      </div>
      {#if showEmojiPicker}
        <div class={styles.emojiPicker}>
          <div class={styles.emojiGrid}>
            {#each emojiList as e}
              <button
                class={`${styles.emojiItem} ${emoji === e ? styles.active : ''}`}
                on:click={() => { emoji = e; showEmojiPicker = false; }}
              >
                {e}
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- 날짜 -->
    <div class={styles.section}>
      <div class={styles.dateGroup}>
        <input type="date" class={styles.dateInput} bind:value={startAt} />
        <input type="date" class={styles.dateInput} bind:value={endAt} />
      </div>
    </div>

    <!-- 할 일 -->
    <div class={styles.section}>
      <div class={styles.todosContainer}>
        {#each todos as todo, i}
          <div class={styles.todoInputGroup}>
            <span class={styles.todoNumber}>{i + 1}</span>
            <input class={styles.todoInput} bind:value={todo.content} />
            <button class={styles.todoRemoveBtn} on:click={() => removeTodo(i)}>✕</button>
          </div>
        {/each}
        <button class={styles.addTodoBtn} on:click={addTodo}>할 일 추가</button>
      </div>
    </div>

    <!-- 설명 -->
    <div class={styles.section}>
      <textarea class={styles.descriptionInput} bind:value={description} maxlength="500" />
      <div class={styles.charCount}>{description.length}/500</div>
    </div>

    <!-- 공개 범위 -->
    <div class={styles.section}>
      <div class={styles.visibilityOptions}>
        {#each ['public','friends','private'] as v}
          <button
            class={`${styles.visibilityBtn} ${visibility === v ? styles.active : ''}`}
            on:click={() => visibility = v as Visibility}
          >
            {v}
          </button>
        {/each}
      </div>
    </div>
  </main>
</div>
