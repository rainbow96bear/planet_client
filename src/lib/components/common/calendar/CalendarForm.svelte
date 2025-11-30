<script lang="ts">
 import { createEventDispatcher } from 'svelte';
 import { goto } from '$app/navigation';
 // CSS 모듈 임포트
 import styles from './CalendarForm.module.css';
 import { authFetch } from '$lib/utils/authFetch';
	import { userProfile } from '$lib/stores';

 // 💡 [추가] userProfile 스토어 임포트 및 타입 정의
 
 // Store 타입 정의 (store를 사용하는 방식만 보여주기 위해 eventData에서는 삭제)
 // export interface UserProfile { ... } // 이 정의는 $lib/types/profile에 있다고 가정

 type Visibility = 'public' | 'friends' | 'private';

 export let eventData: {
 title?: string;
 emoji?: string;
 startAt?: string;
 endAt?: string;
 description?: string;
 visibility?: Visibility;
 todos?: { content: string; completed: boolean }[];
 imageUrl?: string;
 eventId?: number; // 삭제 API 호출에 필요
 // nickname은 이제 store에서 가져옵니다.
 } = {};

 const dispatch = createEventDispatcher();

 let title = eventData.title || '';
 let emoji = eventData.emoji || '📝';
 let startAt = eventData.startAt || '';
 let endAt = eventData.endAt || '';
 let description = eventData.description || '';
 let visibility: Visibility = (eventData.visibility as Visibility) || 'public';
 let todos = eventData.todos?.length ? [...eventData.todos] : [{ content: '', completed: false }];

 // 이미지 관련 (MVP에서는 미사용, 추후 확장용)
 let selectedImage: File | null = null;
 let previewUrl: string | null = eventData.imageUrl || null;
 const ENABLE_IMAGE_UPLOAD = false;

 let showEmojiPicker = false;

 const emojiList = [
 '📝','💼','📚','💪','🏃','🧘','🍳','🎨','🎵','✈️',
 '🏝️','🚄','🎯','💻','📷','🎮','⚽','🎬','🛒','🏠',
 '🌟','❤️','🎉','🔥','✨','🌈','🎁','📱','🎸','🍕'
 ];

 function addTodo() {
 // 할 일 목록 10개 제한 로직
 if (todos.length >= 10) {
 alert('할 일 목록은 최대 10개까지만 추가할 수 있습니다.');
 return;
 }
 todos = [...todos, { content: '', completed: false }];
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

 const filteredTodos = todos.filter(t => t.content.trim() !== '');

 const overLengthTodo = filteredTodos.find(t => t.content.length > 150);
 if (overLengthTodo) {
 alert(`할 일 목록은 최대 150자까지 입력 가능합니다.\n현재 "${overLengthTodo.content.substring(0, 20)}..." 항목이 150자를 초과했습니다.`);
 return;
 }

 const payload = {
 title,
 emoji,
 startAt,
 endAt,
 description,
 visibility,
 todos: filteredTodos,
 imageUrl: previewUrl
 };

 dispatch('submit', payload);
 }

 function handleCancel() {
 if (title || description || todos.some(t => t.content.trim())) {
 if (!confirm('작성 중인 내용이 사라집니다. 취소하시겠습니까?')) {
 return;
 }
 }
 dispatch('cancel');
 }

/**
 * 일정을 삭제하고 성공 시 사용자 프로필 페이지로 리다이렉션합니다.
 */
async function handleDelete() {
 // ⚠️ eventId가 없는 경우 처리
 if (!eventData.eventId) {
 alert('삭제할 일정 ID가 없습니다.');
 return;
 }
 
 // 💡 닉네임을 Svelte Store에서 가져옴 ($userProfile 사용)
 const currentProfile = $userProfile;
 if (!currentProfile || !currentProfile.nickname) {
 console.error('Nickname is missing in store for redirection.');
 return;
 }
 const nickname = currentProfile.nickname; // Store에서 nickname 추출

 if (confirm('정말 이 일정을 삭제하시겠습니까?\n삭제된 일정은 복구할 수 없습니다.')) {
 try {
  // 💡 API 호출: 일정 삭제
  const res = await authFetch(`/api/me/calendar/events/${eventData.eventId}`, { 
   method: 'DELETE'
  });
  
  if (res.ok) {
   // 👈 삭제 성공 시 store에서 가져온 nickname으로 리다이렉션
   await goto(`/profile/${nickname}`); 
  } else {
   const errorData = await res.json().catch(() => ({ message: '삭제 실패' }));
   // HTTP 상태 코드가 2xx가 아닐 경우 에러 처리
   throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
  }

 } catch (error) {
  console.error("Event deletion failed:", error);
 }
 }
}
</script>

<div class={styles.calendarFormContainer}>
 <header class={styles.formHeader}>
 <button class={styles.backBtn} on:click={handleCancel} type="button" aria-label="이전 화면으로 돌아가기 또는 작성 취소">
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M12 4L6 10L12 16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>
 </button>
 <h1 class={styles.formTitle}>{eventData.title ? '일정 수정' : '새 일정'}</h1>
 <div class={styles.headerActions}>
  {#if eventData.title}
  <button class={styles.deleteBtn} on:click={handleDelete} type="button">삭제</button>
  {/if}
  <button class={styles.saveBtn} on:click={handleSubmit} type="button">완료</button>
 </div>
 </header>

 <main class={styles.formContent}>
 <div class={styles.section}>
  <div class={styles.emojiTitleGroup}>
  <button 
   class={styles.emojiBtn} 
   on:click={() => showEmojiPicker = !showEmojiPicker}
   type="button"
   aria-label="이모지 선택 열기" 
  >
   <span class={styles.emojiDisplay}>{emoji}</span>
  </button>
  <input 
   type="text" 
   bind:value={title} 
   placeholder="일정 제목을 입력하세요 (최대 50자)" 
   class={styles.titleInput}
   maxlength="50"
   required
   id="event-title" 
   aria-label="일정 제목" 
  />
  </div>
  {#if showEmojiPicker}
  <div class={styles.emojiPicker}>
   <div class={styles.emojiGrid}>
   {#each emojiList as e}
    <button 
    class={styles.emojiItem} 
    class:selected={emoji === e}
    on:click={() => selectEmoji(e)}
    type="button"
    aria-label="{e} 이모지 선택" 
    >
    {e}
    </button>
   {/each}
   </div>
  </div>
  {/if}
 </div>

 <div class={styles.section}>
  <div class={styles.sectionLabel}>   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
   <rect x="3" y="4" width="18" height="18" rx="2"/>
   <line x1="16" y1="2" x2="16" y2="6"/>
   <line x1="8" y1="2" x2="8" y2="6"/>
   <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
  날짜
  </div>
  <div class={styles.dateGroup}>
  <div class={styles.dateInputWrapper}>
   <label class={styles.dateLabel} for="start-at">시작</label> 
   <input type="date" bind:value={startAt} class={styles.dateInput} required id="start-at" /> 
  </div>
  <div class={styles.dateInputWrapper}>
   <label class={styles.dateLabel} for="end-at">종료</label> 
   <input type="date" bind:value={endAt} class={styles.dateInput} required id="end-at" /> 
  </div>
  </div>
 </div>
 
 <div class={styles.section}>
  <div class={styles.sectionHeader}>   <div class={styles.sectionLabel}>    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
   <polyline points="9 11 12 14 22 4"/>
   <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
   </svg>
   할 일 목록
  </div>
  <div class={styles.sectionNote}>
   <span class={styles.noteText}>**할 일 목록은 최대 150자**까지 입력 가능합니다. (최대 10개)</span>
  </div>
  </div>
 
  <div class={styles.todosContainer}>
  {#each todos as todo, i}
   <div class={styles.todoInputGroup}>
   <span class={styles.todoNumber}>{i + 1}</span>
   
   <input 
    type="text" 
    bind:value={todo.content} 
    class={styles.todoInput} 
    placeholder="할 일을 입력하세요 (최대 150자)"
    maxlength="150" 
    id={`todo-${i}`} 
    aria-label={`할 일 ${i + 1} 내용 입력`} 
   />
   
   <button 
    class={styles.todoRemoveBtn}
    on:click={() => removeTodo(i)}
    disabled={todos.length === 1}
    type="button"
    aria-label={`할 일 ${i + 1} 삭제`} 
   >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
   </button>
   </div>
  {/each}
   {#if todos.length <10}
  <button 
   class={styles.addTodoBtn} 
   on:click={addTodo} 
   type="button"
   disabled={todos.length >= 10}
  >
   <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
   <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
   </svg>
   할 일 추가
  </button>
  {/if}
  </div>

 </div>

 <div class={styles.section}>
  <label class={styles.sectionLabel} for="event-description">   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
  placeholder="일정에 대한 설명을 입력하세요 (선택사항, 최대 500자)" 
  class={styles.descriptionInput}
  maxlength="500"
  id="event-description" 
  ></textarea>
  <div class={styles.charCount}>{description.length}/500</div>
 </div>

 <div class={styles.section}>
  <div class={styles.sectionLabel}>   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
   <circle cx="12" cy="12" r="10"/>
   <line x1="2" y1="12" x2="22" y2="12"/>
   <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
  공개 범위
  </div>
  <div class={styles.visibilityOptions}>
  <button
   class="{styles.visibilityBtn} {visibility === 'public' ? styles.active : ''}"
   on:click={() => visibility = 'public'}
   type="button"
   aria-label="공개 범위: 전체 공개" 
  >
   <span class={styles.visibilityIcon}>🌍</span>
   <span class={styles.visibilityText}>전체 공개</span>
  </button>
  <button
   class="{styles.visibilityBtn} {visibility === 'friends' ? styles.active : ''}"
   on:click={() => visibility = 'friends'}
   type="button"
   aria-label="공개 범위: 친구 공개" 
  >
   <span class={styles.visibilityIcon}>👥</span>
   <span class={styles.visibilityText}>친구 공개</span>
  </button>
  <button
   class="{styles.visibilityBtn} {visibility === 'private' ? styles.active : ''}"
   on:click={() => visibility = 'private'}
   type="button"
   aria-label="공개 범위: 나만 보기" 
  >
   <span class={styles.visibilityIcon}>🔒</span>
   <span class={styles.visibilityText}>나만 보기</span>
  </button>
  </div>
 </div>
 </main>
</div>