<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let eventData: {
    title?: string;
    emoji?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    visibility?: 'public' | 'friends' | 'private';
    todos?: { text: string; completed: boolean }[];
    imageUrl?: string;
  } = {};

  const dispatch = createEventDispatcher();

  let title = eventData.title || '';
  let emoji = eventData.emoji || '📝';
  let startDate = eventData.startDate || '';
  let endDate = eventData.endDate || '';
  let description = eventData.description || '';
  let visibility: 'public' | 'friends' | 'private' = eventData.visibility || 'public';
  let todos = eventData.todos?.length ? [...eventData.todos] : [{ text: '', completed: false }];
  let selectedImage: File | null = null;
  let previewUrl: string | null = eventData.imageUrl || null;
  let showEmojiPicker = false;

  const emojiList = [
    '📝','💼','📚','💪','🏃','🧘','🍳','🎨','🎵','✈️',
    '🏝️','🚄','🎯','💻','📷','🎮','⚽','🎬','🛒','🏠',
    '🌟','❤️','🎉','🔥','✨','🌈','🎁','📱','🎸','🍕'
  ];

  function addTodo() {
    todos = [...todos, { text: '', completed: false }];
  }

  function removeTodo(index: number) {
    todos = todos.filter((_, i) => i !== index);
  }

  function selectEmoji(selected: string) {
    emoji = selected;
    showEmojiPicker = false;
  }

  function handleImageUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      selectedImage = target.files[0];
      previewUrl = URL.createObjectURL(selectedImage);
    }
  }

  function removeImage() {
    selectedImage = null;
    previewUrl = null;
  }

  async function handleSubmit() {
    if (!title.trim() || !startDate || !endDate) {
      alert('제목과 날짜는 필수입니다.');
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      alert('종료일이 시작일보다 빠를 수 없습니다.');
      return;
    }

    const filteredTodos = todos.filter(t => t.text.trim() !== '');
    const payload = new FormData();
    payload.append('title', title);
    payload.append('emoji', emoji);
    payload.append('startDate', startDate);
    payload.append('endDate', endDate);
    payload.append('description', description);
    payload.append('visibility', visibility);
    payload.append('todos', JSON.stringify(filteredTodos));
    if (selectedImage) payload.append('image', selectedImage);

    dispatch('submit', payload);
  }

  function handleCancel() {
    if (confirm('작성 중인 내용이 사라집니다. 취소하시겠습니까?')) {
      dispatch('cancel');
    }
  }

  function handleDelete() {
    if (confirm('정말 이 일정을 삭제하시겠습니까?')) {
      dispatch('delete');
    }
  }
</script>

<div class="calendar-form-container">
  <header class="form-header">
    <button class="back-btn" on:click={handleCancel}>← 취소</button>
    <h1 class="form-title">{eventData.title ? '일정 수정' : '새 일정 추가'}</h1>
    <div class="header-actions">
      {#if eventData.title}
        <button class="delete-btn" on:click={handleDelete}>삭제</button>
      {/if}
      <button class="save-btn" on:click={handleSubmit}>완료</button>
    </div>
  </header>

  <main class="form-content">
    <!-- 이모지 & 제목 -->
    <div class="section">
      <div class="emoji-title-group">
        <button class="emoji-btn" on:click={() => showEmojiPicker = !showEmojiPicker}>
          <span class="emoji-display">{emoji}</span>
        </button>
        <input type="text" bind:value={title} placeholder="일정 제목" class="title-input" maxlength="50" />
      </div>
      {#if showEmojiPicker}
        <div class="emoji-picker">
          <div class="emoji-grid">
            {#each emojiList as e}
              <button class="emoji-item" on:click={() => selectEmoji(e)}>{e}</button>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- 날짜 -->
    <div class="section">
      <label class="section-label">📅 날짜</label>
      <div class="date-group">
        <div class="date-input-wrapper">
          <label>시작일</label>
          <input type="date" bind:value={startDate} class="date-input" />
        </div>
        <span class="date-divider">~</span>
        <div class="date-input-wrapper">
          <label>종료일</label>
          <input type="date" bind:value={endDate} class="date-input" />
        </div>
      </div>
    </div>

    <!-- 할 일 -->
    <div class="section">
      <label class="section-label">✓ 할 일 목록</label>
      {#each todos as todo, i}
        <div class="todo-input-group">
          <span>{i + 1}</span>
          <input type="text" bind:value={todo.text} class="todo-input" placeholder="할 일 입력" />
          {#if todos.length > 1}
            <button on:click={() => removeTodo(i)}>✕</button>
          {/if}
        </div>
      {/each}
      <button on:click={addTodo}>+ 할 일 추가</button>
    </div>

    <!-- 설명 -->
    <div class="section">
      <label>📝 설명</label>
      <textarea bind:value={description} rows="4" placeholder="내용 입력" class="description-input"></textarea>
      <div>{description.length}/500</div>
    </div>

    <!-- 이미지 -->
    <div class="section">
      <label>📷 이미지</label>
      {#if previewUrl}
        <div class="image-preview">
          <img src={previewUrl} alt="미리보기" />
          <button on:click={removeImage}>✕</button>
        </div>
      {:else}
        <label>
          <input type="file" accept="image/*" on:change={handleImageUpload} hidden />
          이미지 선택
        </label>
      {/if}
    </div>

    <!-- 공개 범위 -->
    <div class="section">
      <label>🌍 공개 범위</label>
      <div class="visibility-options">
        {#each ['public','friends','private'] as v}
          <button
            class:active={visibility===v}
            on:click={()=>visibility=v}
          >
            {v === 'public' ? '전체 공개' : v === 'friends' ? '친구 공개' : '나만 보기'}
          </button>
        {/each}
      </div>
    </div>
  </main>
</div>

<style>
.calendar-form-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 24px;
  background: var(--bg-primary);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.form-title {
  font-size: 1.5rem;
  flex-grow: 1;
  text-align: center;
}

.section {
  margin-bottom: 16px;
}

.section-label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
}

input, select, textarea, button {
  border-radius: 6px;
  border: 1px solid var(--border-color);
  padding: 8px;
}

input, select, textarea {
  width: 100%;
  background: var(--bg-secondary);
}

button {
  cursor: pointer;
}

.save-btn {
  background: var(--color-primary);
  color: #fff;
  border: none;
  padding: 8px 14px;
}

.delete-btn {
  background: #ff4d4f;
  color: #fff;
  border: none;
  padding: 8px 14px;
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
}
</style>
