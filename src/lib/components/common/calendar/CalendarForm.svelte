<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  type Visibility = 'public' | 'friends' | 'private';

  export let eventData: {
    title?: string;
    emoji?: string;
    startAt?: string;
    endAt?: string;
    description?: string;
    visibility?: Visibility;
    todos?: { text: string; completed: boolean }[];
    imageUrl?: string;
  } = {};

  const dispatch = createEventDispatcher();

  let title = eventData.title || '';
  let emoji = eventData.emoji || '📝';
  let startAt = eventData.startAt || '';
  let endAt = eventData.endAt || '';
  let description = eventData.description || '';
  let visibility: Visibility = (eventData.visibility as Visibility) || 'public';
  let todos = eventData.todos?.length ? [...eventData.todos] : [{ text: '', completed: false }];
  
  // 이미지 관련 (MVP에서는 미사용, 추후 확장용)
  let selectedImage: File | null = null;
  let previewUrl: string | null = eventData.imageUrl || null;
  const ENABLE_IMAGE_UPLOAD = false; // 추후 true로 변경
  
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
    if (todos.length === 1) return;
    todos = todos.filter((_, i) => i !== index);
  }

  function selectEmoji(selected: string) {
    emoji = selected;
    showEmojiPicker = false;
  }

  // 추후 이미지 업로드 기능 활성화 시 사용
  function handleImageSelect(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  function removeImage() {
    selectedImage = null;
    previewUrl = null;
  }

  function handleSubmit() {
    if (!title.trim()) {
      alert('일정 제목을 입력해주세요.');
      return;
    }
    if (!startAt || !endAt) {
      alert('시작일과 종료일을 선택해주세요.');
      return;
    }
    if (new Date(startAt) > new Date(endAt)) {
      alert('종료일은 시작일보다 이후여야 합니다.');
      return;
    }

    const filteredTodos = todos.filter(t => t.text.trim() !== '');
    const payload = {
      title,
      emoji,
      startAt,
      endAt,
      description,
      visibility,
      todos: filteredTodos,
      // image 관련은 아직 비활성화므로 제외 또는 imageUrl만 보낼 수 있음
      imageUrl: previewUrl // 있으면 보내고 없으면 undefined
    };

    dispatch('submit', payload);
  }

  function handleCancel() {
    if (title || description || todos.some(t => t.text.trim())) {
      if (!confirm('작성 중인 내용이 사라집니다. 취소하시겠습니까?')) {
        return;
      }
    }
    dispatch('cancel');
  }

  function handleDelete() {
    if (confirm('정말 이 일정을 삭제하시겠습니까?\n삭제된 일정은 복구할 수 없습니다.')) {
      dispatch('delete');
    }
  }
</script>

<div class="calendar-form-container">
  <header class="form-header">
    <button class="back-btn" on:click={handleCancel} type="button">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M12 4L6 10L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>
    <h1 class="form-title">{eventData.title ? '일정 수정' : '새 일정'}</h1>
    <div class="header-actions">
      {#if eventData.title}
        <button class="delete-btn" on:click={handleDelete} type="button">삭제</button>
      {/if}
      <button class="save-btn" on:click={handleSubmit} type="button">완료</button>
    </div>
  </header>

  <main class="form-content">
    <!-- 이모지 & 제목 -->
    <div class="section emoji-title-section">
      <div class="emoji-title-group">
        <button 
          class="emoji-btn" 
          on:click={() => showEmojiPicker = !showEmojiPicker}
          type="button"
          aria-label="이모지 선택"
        >
          <span class="emoji-display">{emoji}</span>
        </button>
        <input 
          type="text" 
          bind:value={title} 
          placeholder="일정 제목을 입력하세요" 
          class="title-input" 
          maxlength="50"
          required
        />
      </div>
      {#if showEmojiPicker}
        <div class="emoji-picker">
          <div class="emoji-grid">
            {#each emojiList as e}
              <button 
                class="emoji-item" 
                class:selected={emoji === e}
                on:click={() => selectEmoji(e)}
                type="button"
              >
                {e}
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- 날짜 -->
    <div class="section">
      <label class="section-label">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        날짜
      </label>
      <div class="date-group">
        <div class="date-input-wrapper">
          <label class="date-label">시작</label>
          <input type="date" bind:value={startAt} class="date-input" required />
        </div>
        <span class="date-divider">→</span>
        <div class="date-input-wrapper">
          <label class="date-label">종료</label>
          <input type="date" bind:value={endAt} class="date-input" required />
        </div>
      </div>
    </div>

    <!-- 할 일 -->
    <div class="section">
      <label class="section-label">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 11 12 14 22 4"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
        할 일 목록
      </label>
      <div class="todos-container">
        {#each todos as todo, i}
          <div class="todo-input-group">
            <span class="todo-number">{i + 1}</span>
            <input 
              type="text" 
              bind:value={todo.text} 
              class="todo-input" 
              placeholder="할 일을 입력하세요"
            />
            <button 
              class="todo-remove-btn"
              on:click={() => removeTodo(i)}
              disabled={todos.length === 1}
              type="button"
              aria-label="할 일 삭제"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        {/each}
        <button class="add-todo-btn" on:click={addTodo} type="button">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          할 일 추가
        </button>
      </div>
    </div>

    <!-- 설명 -->
    <div class="section">
      <label class="section-label">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10 9 9 9 8 9"/>
        </svg>
        설명
      </label>
      <textarea 
        bind:value={description} 
        rows="4" 
        placeholder="일정에 대한 설명을 입력하세요 (선택사항)" 
        class="description-input"
        maxlength="500"
      ></textarea>
      <div class="char-count">{description.length}/500</div>
    </div>

    <!-- 이미지 업로드 (추후 확장용 - 현재 비활성화) -->
    {#if ENABLE_IMAGE_UPLOAD}
      <div class="section">
        <label class="section-label">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          이미지
        </label>
        {#if previewUrl}
          <div class="image-preview">
            <img src={previewUrl} alt="미리보기" />
            <button class="image-remove-btn" on:click={removeImage} type="button">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2"/>
              </svg>
            </button>
          </div>
        {:else}
          <label class="image-upload-label">
            <input 
              type="file" 
              accept="image/*" 
              on:change={handleImageSelect}
              class="image-input"
            />
            <div class="upload-placeholder">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span>이미지 업로드</span>
            </div>
          </label>
        {/if}
      </div>
    {/if}

    <!-- 공개 범위 -->
    <div class="section">
      <label class="section-label">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        공개 범위
      </label>
      <div class="visibility-options">
        <button
          class="visibility-btn"
          class:active={visibility === 'public'}
          on:click={() => visibility = 'public'}
          type="button"
        >
          <span class="visibility-icon">🌍</span>
          <span class="visibility-text">전체 공개</span>
        </button>
        <button
          class="visibility-btn"
          class:active={visibility === 'friends'}
          on:click={() => visibility = 'friends'}
          type="button"
        >
          <span class="visibility-icon">👥</span>
          <span class="visibility-text">친구 공개</span>
        </button>
        <button
          class="visibility-btn"
          class:active={visibility === 'private'}
          on:click={() => visibility = 'private'}
          type="button"
        >
          <span class="visibility-icon">🔒</span>
          <span class="visibility-text">나만 보기</span>
        </button>
      </div>
    </div>
  </main>
</div>

<style>
  .calendar-form-container {
    margin: 0 auto;
    padding: 0;
    min-height: 100vh;
  }

  .form-header {
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    background: #ffffff;
    border-bottom: 1px solid #e5e7eb;
    z-index: 10;
  }

  .back-btn {
    background: none;
    border: none;
    padding: 8px;
    color: #374151;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
  }

  .back-btn:hover {
    color: #111827;
  }

  .form-title {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
    margin: 0;
    flex: 1;
    text-align: center;
  }

  .header-actions {
    display: flex;
    gap: 8px;
  }

  .delete-btn,
  .save-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .delete-btn {
    background: #fee;
    color: #dc2626;
  }

  .delete-btn:hover {
    background: #fdc;
  }

  .save-btn {
    background: #3b82f6;
    color: white;
  }

  .save-btn:hover {
    background: #2563eb;
  }

  .form-content {
    padding: 20px;
  }

  .section {
    margin-bottom: 24px;
  }

  .section-label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 10px;
  }

  .section-label svg {
    color: #6b7280;
  }

  /* 이모지 & 제목 */
  .emoji-title-section {
    position: relative;
  }

  .emoji-title-group {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .emoji-btn {
    background: #f3f4f6;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .emoji-btn:hover {
    background: #e5e7eb;
    border-color: #d1d5db;
  }

  .emoji-display {
    font-size: 28px;
    line-height: 1;
  }

  .title-input {
    flex: 1;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    padding: 14px 16px;
    font-size: 16px;
    background: #ffffff;
    transition: border-color 0.2s;
  }

  .title-input:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .emoji-picker {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 8px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    z-index: 20;
  }

  .emoji-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 4px;
    max-width: 100%;
  }

  .emoji-item {
    background: none;
    border: 2px solid transparent;
    border-radius: 8px;
    padding: 8px;
    font-size: 24px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .emoji-item:hover {
    background: #f3f4f6;
  }

  .emoji-item.selected {
    border-color: #3b82f6;
    background: #eff6ff;
  }

  /* 날짜 */
  .date-group {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .date-input-wrapper {
    flex: 1;
  }

  .date-label {
    display: block;
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 6px;
  }

  .date-input {
    width: 100%;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    padding: 12px;
    font-size: 14px;
    background: #ffffff;
    transition: border-color 0.2s;
  }

  .date-input:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .date-divider {
    color: #9ca3af;
    font-size: 18px;
    margin-top: 20px;
  }

  /* 할 일 */
  .todos-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .todo-input-group {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #f9fafb;
    padding: 10px 12px;
    border-radius: 10px;
    border: 2px solid transparent;
    transition: all 0.2s;
  }

  .todo-input-group:focus-within {
    background: white;
    border-color: #3b82f6;
  }

  .todo-number {
    font-size: 14px;
    font-weight: 500;
    color: #6b7280;
    min-width: 20px;
    text-align: center;
  }

  .todo-input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 4px 0;
    font-size: 14px;
  }

  .todo-input:focus {
    outline: none;
  }

  .todo-remove-btn {
    background: none;
    border: none;
    padding: 4px;
    color: #9ca3af;
    cursor: pointer;
    transition: color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .todo-remove-btn:hover:not(:disabled) {
    color: #ef4444;
  }

  .todo-remove-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .add-todo-btn {
    background: none;
    border: 2px dashed #d1d5db;
    border-radius: 10px;
    padding: 12px;
    color: #6b7280;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.2s;
  }

  .add-todo-btn:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    background: #eff6ff;
  }

  /* 설명 */
  .description-input {
    width: 100%;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    padding: 12px;
    font-size: 14px;
    font-family: inherit;
    resize: vertical;
    background: #ffffff;
    transition: border-color 0.2s;
    line-height: 1.5;
  }

  .description-input:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .char-count {
    text-align: right;
    font-size: 12px;
    color: #9ca3af;
    margin-top: 6px;
  }

  /* 이미지 업로드 (추후 확장용) */
  .image-upload-label {
    display: block;
    cursor: pointer;
  }

  .image-input {
    display: none;
  }

  .upload-placeholder {
    border: 2px dashed #d1d5db;
    border-radius: 12px;
    padding: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: #6b7280;
    transition: all 0.2s;
  }

  .upload-placeholder:hover {
    border-color: #3b82f6;
    color: #3b82f6;
    background: #eff6ff;
  }

  .image-preview {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    max-width: 100%;
  }

  .image-preview img {
    width: 100%;
    height: auto;
    display: block;
  }

  .image-remove-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0,0,0,0.6);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    cursor: pointer;
    transition: background 0.2s;
  }

  .image-remove-btn:hover {
    background: rgba(0,0,0,0.8);
  }

  /* 공개 범위 */
  .visibility-options {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .visibility-btn {
    background: #f9fafb;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    padding: 12px 8px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
  }

  .visibility-btn:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }

  .visibility-btn.active {
    background: #eff6ff;
    border-color: #3b82f6;
    color: #3b82f6;
  }

  .visibility-icon {
    font-size: 20px;
  }

  .visibility-text {
    font-size: 13px;
    font-weight: 500;
  }

  /* 반응형 */
  @media (max-width: 640px) {
    .form-content {
      padding: 16px;
    }

    .emoji-grid {
      grid-template-columns: repeat(6, 1fr);
    }

    .date-group {
      flex-direction: column;
      align-items: stretch;
    }

    .date-divider {
      text-align: center;
      margin: 4px 0;
    }
  }
</style>