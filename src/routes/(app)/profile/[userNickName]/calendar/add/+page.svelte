<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  
  let title = '';
  let emoji = '📝';
  let startDate = '';
  let endDate = '';
  let description = '';
  let visibility: 'public' | 'friends' | 'private' = 'public';
  let todos: Array<{ text: string; completed: boolean }> = [
    { text: '', completed: false }
  ];
  let selectedImage: File | null = null;
  let previewUrl: string | null = null;
  
  // 이모지 선택기
  let showEmojiPicker = false;
  const emojiList = [
    '📝', '💼', '📚', '💪', '🏃', '🧘', '🍳', '🎨', '🎵', '✈️',
    '🏝️', '🚄', '🎯', '💻', '📷', '🎮', '⚽', '🎬', '🛒', '🏠',
    '🌟', '❤️', '🎉', '🔥', '✨', '🌈', '🎁', '📱', '🎸', '🍕'
  ];
  
  onMount(() => {
    // 오늘 날짜를 기본값으로 설정
    const today = new Date().toISOString().split('T')[0];
    startDate = today;
    endDate = today;
    
    const current = get(auth);
    if (!current.access_token) {
      alert('로그인이 필요합니다.');
      goto(`/login`);
    }
  });
  
  function addTodo() {
    todos = [...todos, { text: '', completed: false }];
  }
  
  function removeTodo(index: number) {
    todos = todos.filter((_, i) => i !== index);
  }
  
  function selectEmoji(selectedEmoji: string) {
    emoji = selectedEmoji;
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
    // 유효성 검사
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    
    if (!startDate || !endDate) {
      alert('날짜를 선택해주세요.');
      return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
      alert('종료일이 시작일보다 빠를 수 없습니다.');
      return;
    }
    
    // 빈 할 일 제거
    const filteredTodos = todos.filter(todo => todo.text.trim() !== '');
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('emoji', emoji);
    formData.append('startDate', startDate);
    formData.append('endDate', endDate);
    formData.append('description', description);
    formData.append('visibility', visibility);
    formData.append('todos', JSON.stringify(filteredTodos));
    
    if (selectedImage) {
      formData.append('image', selectedImage);
    }
    
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        alert('일정이 추가되었습니다! 🎉');
        goto('/profile');
      } else {
        alert('일정 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('오류가 발생했습니다.');
    }
  }
  
  function handleCancel() {
    if (confirm('작성 중인 내용이 사라집니다. 취소하시겠습니까?')) {
      goto('/profile');
    }
  }
</script>

<div class="container">
  <!-- 헤더 -->
  <header class="header">
    <button class="back-btn" on:click={handleCancel}>
      ← 취소
    </button>
    <h1 class="title">새 일정 추가</h1>
    <button class="save-btn" on:click={handleSubmit}>
      완료
    </button>
  </header>

  <!-- 폼 -->
  <main class="content">
    <!-- 이모지 & 제목 -->
    <div class="section">
      <div class="emoji-title-group">
        <button class="emoji-btn" on:click={() => showEmojiPicker = !showEmojiPicker}>
          <span class="emoji-display">{emoji}</span>
        </button>
        
        <input
          type="text"
          bind:value={title}
          placeholder="일정 제목을 입력하세요"
          class="title-input"
          maxlength="50"
        />
      </div>
      
      {#if showEmojiPicker}
        <div class="emoji-picker">
          <div class="emoji-grid">
            {#each emojiList as emojiItem}
              <button
                class="emoji-item"
                on:click={() => selectEmoji(emojiItem)}
              >
                {emojiItem}
              </button>
            {/each}
          </div>
        </div>
      {/if}
    </div>

    <!-- 날짜 선택 -->
    <div class="section">
      <label class="section-label">📅 날짜</label>
      <div class="date-group">
        <div class="date-input-wrapper">
          <label class="date-label">시작일</label>
          <input
            type="date"
            bind:value={startDate}
            class="date-input"
          />
        </div>
        <span class="date-divider">~</span>
        <div class="date-input-wrapper">
          <label class="date-label">종료일</label>
          <input
            type="date"
            bind:value={endDate}
            class="date-input"
          />
        </div>
      </div>
    </div>

    <!-- 할 일 목록 -->
    <div class="section">
      <label class="section-label">✓ 할 일 목록</label>
      <div class="todos-list">
        {#each todos as todo, index}
          <div class="todo-input-group">
            <span class="todo-number">{index + 1}</span>
            <input
              type="text"
              bind:value={todo.text}
              placeholder="할 일을 입력하세요"
              class="todo-input"
              maxlength="100"
            />
            {#if todos.length > 1}
              <button class="remove-todo-btn" on:click={() => removeTodo(index)}>
                ✕
              </button>
            {/if}
          </div>
        {/each}
      </div>
      <button class="add-todo-btn" on:click={addTodo}>
        + 할 일 추가
      </button>
    </div>

    <!-- 설명 -->
    <div class="section">
      <label class="section-label">📝 설명 (선택)</label>
      <textarea
        bind:value={description}
        placeholder="일정에 대한 추가 설명을 입력하세요"
        class="description-input"
        rows="4"
        maxlength="500"
      ></textarea>
      <div class="char-count">{description.length} / 500</div>
    </div>

    <!-- 이미지 첨부 -->
    <div class="section">
      <label class="section-label">📷 이미지 (선택)</label>
      {#if previewUrl}
        <div class="image-preview">
          <img src={previewUrl} alt="미리보기" class="preview-image" />
          <button class="remove-image-btn" on:click={removeImage}>
            ✕ 이미지 제거
          </button>
        </div>
      {:else}
        <label class="image-upload-btn">
          <input
            type="file"
            accept="image/*"
            on:change={handleImageUpload}
            class="hidden-input"
          />
          <span class="upload-icon">📷</span>
          <span>이미지 선택</span>
        </label>
      {/if}
    </div>

    <!-- 공개 범위 -->
    <div class="section">
      <label class="section-label">🌍 공개 범위</label>
      <div class="visibility-options">
        <button
          class="visibility-btn"
          class:active={visibility === 'public'}
          on:click={() => visibility = 'public'}
        >
          <span class="visibility-icon">🌍</span>
          <div class="visibility-info">
            <div class="visibility-name">전체 공개</div>
            <div class="visibility-desc">모든 사람이 볼 수 있어요</div>
          </div>
        </button>
        
        <button
          class="visibility-btn"
          class:active={visibility === 'friends'}
          on:click={() => visibility = 'friends'}
        >
          <span class="visibility-icon">👥</span>
          <div class="visibility-info">
            <div class="visibility-name">친구 공개</div>
            <div class="visibility-desc">친구만 볼 수 있어요</div>
          </div>
        </button>
        
        <button
          class="visibility-btn"
          class:active={visibility === 'private'}
          on:click={() => visibility = 'private'}
        >
          <span class="visibility-icon">🔒</span>
          <div class="visibility-info">
            <div class="visibility-name">나만 보기</div>
            <div class="visibility-desc">나만 볼 수 있어요</div>
          </div>
        </button>
      </div>
    </div>

    <!-- 제출 버튼 -->
    <div class="submit-section">
      <button class="submit-btn" on:click={handleSubmit}>
        일정 추가하기 🚀
      </button>
    </div>
  </main>
</div>

<style>
  .container {
    margin: 0 auto;
    min-height: 100vh;
    background: linear-gradient(to bottom, var(--bg-gradient-start), var(--bg-gradient-end));
  }

  /* 헤더 */
  .header {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-light);
    backdrop-filter: blur(10px);
  }

  .back-btn,
  .save-btn {
    padding: 0.5rem 1rem;
    border: none;
    background: none;
    color: var(--color-primary);
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .back-btn:hover,
  .save-btn:hover {
    opacity: 0.7;
  }

  .title {
    font-size: 1.125rem;
    font-weight: bold;
    color: var(--text-primary);
    margin: 0;
  }

  /* 콘텐츠 */
  .content {
    padding: 1.5rem;
  }

  .section {
    margin-bottom: 2rem;
  }

  .section-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
  }

  /* 이모지 & 제목 */
  .emoji-title-group {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .emoji-btn {
    width: 4rem;
    height: 4rem;
    border-radius: 1rem;
    border: 2px solid var(--border-light);
    background: var(--bg-primary);
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .emoji-btn:hover {
    border-color: var(--color-primary);
    transform: scale(1.05);
  }

  .emoji-display {
    font-size: 2rem;
  }

  .title-input {
    flex: 1;
    padding: 1rem;
    border: 2px solid var(--border-light);
    border-radius: 1rem;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 1rem;
    font-weight: 600;
    outline: none;
    transition: border-color 0.2s;
  }

  .title-input:focus {
    border-color: var(--color-primary);
  }

  .title-input::placeholder {
    color: var(--text-tertiary);
  }

  /* 이모지 선택기 */
  .emoji-picker {
    margin-top: 1rem;
    padding: 1rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-light);
    border-radius: 1rem;
    box-shadow: var(--shadow-md);
  }

  .emoji-grid {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 0.5rem;
  }

  .emoji-item {
    width: 2.5rem;
    height: 2.5rem;
    border: none;
    background: none;
    font-size: 1.5rem;
    cursor: pointer;
    border-radius: 0.5rem;
    transition: all 0.2s;
  }

  .emoji-item:hover {
    background: var(--bg-secondary);
    transform: scale(1.1);
  }

  /* 날짜 */
  .date-group {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .date-input-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .date-label {
    font-size: 0.8125rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .date-input {
    padding: 0.875rem;
    border: 2px solid var(--border-light);
    border-radius: 0.75rem;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 0.9375rem;
    outline: none;
    transition: border-color 0.2s;
  }

  .date-input:focus {
    border-color: var(--color-primary);
  }

  .date-divider {
    color: var(--text-tertiary);
    font-weight: 600;
    margin-top: 1.5rem;
  }

  /* 할 일 목록 */
  .todos-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .todo-input-group {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .todo-number {
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8125rem;
    font-weight: 600;
    flex-shrink: 0;
  }

  .todo-input {
    flex: 1;
    padding: 0.875rem;
    border: 2px solid var(--border-light);
    border-radius: 0.75rem;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 0.9375rem;
    outline: none;
    transition: border-color 0.2s;
  }

  .todo-input:focus {
    border-color: var(--color-primary);
  }

  .todo-input::placeholder {
    color: var(--text-tertiary);
  }

  .remove-todo-btn {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: none;
    background: var(--bg-secondary);
    color: var(--text-tertiary);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .remove-todo-btn:hover {
    background: #FEE2E2;
    color: #EF4444;
  }

  .add-todo-btn {
    width: 100%;
    padding: 0.875rem;
    border: 2px dashed var(--border-light);
    border-radius: 0.75rem;
    background: none;
    color: var(--color-primary);
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .add-todo-btn:hover {
    background: var(--bg-secondary);
    border-color: var(--color-primary);
  }

  /* 설명 */
  .description-input {
    width: 100%;
    padding: 1rem;
    border: 2px solid var(--border-light);
    border-radius: 1rem;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 0.9375rem;
    font-family: inherit;
    outline: none;
    resize: vertical;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }

  .description-input:focus {
    border-color: var(--color-primary);
  }

  .description-input::placeholder {
    color: var(--text-tertiary);
  }

  .char-count {
    text-align: right;
    font-size: 0.75rem;
    color: var(--text-tertiary);
    margin-top: 0.5rem;
  }

  /* 이미지 업로드 */
  .image-upload-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 2rem;
    border: 2px dashed var(--border-light);
    border-radius: 1rem;
    background: var(--bg-primary);
    color: var(--text-secondary);
    font-size: 0.9375rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .image-upload-btn:hover {
    background: var(--bg-secondary);
    border-color: var(--color-primary);
  }

  .upload-icon {
    font-size: 2rem;
  }

  .hidden-input {
    display: none;
  }

  .image-preview {
    position: relative;
  }

  .preview-image {
    width: 100%;
    height: auto;
    max-height: 20rem;
    object-fit: cover;
    border-radius: 1rem;
    border: 2px solid var(--border-light);
  }

  .remove-image-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.5rem;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .remove-image-btn:hover {
    background: rgba(0, 0, 0, 0.9);
  }

  /* 공개 범위 */
  .visibility-options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .visibility-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 2px solid var(--border-light);
    border-radius: 1rem;
    background: var(--bg-primary);
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
  }

  .visibility-btn:hover {
    background: var(--bg-secondary);
  }

  .visibility-btn.active {
    border-color: var(--color-primary);
    background: linear-gradient(135deg, rgba(125,189,182,0.1), rgba(139,157,195,0.1));
  }

  .visibility-icon {
    font-size: 1.5rem;
  }

  .visibility-info {
    flex: 1;
  }

  .visibility-name {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
  }

  .visibility-desc {
    font-size: 0.8125rem;
    color: var(--text-secondary);
  }

  /* 제출 버튼 */
  .submit-section {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border-light);
  }

  .submit-btn {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 1rem;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(125, 189, 182, 0.3);
  }

  .submit-btn:hover {
    transform: scale(1.02);
    box-shadow: 0 6px 16px rgba(125, 189, 182, 0.4);
  }

  .submit-btn:active {
    transform: scale(0.98);
  }

  /* 반응형 */
  @media (max-width: 768px) {
    .content {
      padding: 1rem;
    }

    .emoji-grid {
      grid-template-columns: repeat(8, 1fr);
    }

    .date-group {
      flex-direction: column;
      align-items: stretch;
    }

    .date-divider {
      text-align: center;
      margin-top: 0;
    }
  }

  @media (max-width: 480px) {
    .emoji-grid {
      grid-template-columns: repeat(6, 1fr);
    }
  }
</style>