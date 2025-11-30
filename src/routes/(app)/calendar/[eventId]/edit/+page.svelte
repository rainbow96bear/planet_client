<script lang="ts">
 import CalendarForm from '$lib/components/common/calendar/CalendarForm.svelte';
 import { page } from '$app/stores';
 import { onMount } from 'svelte';
 import { auth, clearAuth } from '$lib/stores/auth';
 import { goto } from '$app/navigation';
 import { get } from 'svelte/store';
 import LoginRequired from '$lib/components/common/loginRequired/LoginRequired.svelte';
 import LoadingSpinner from '$lib/components/common/loadingSpinner/LoadingSpinner.svelte';
 import { userProfile } from '$lib/stores/userProfile';
 // 💡 개선: authFetch 유틸리티 임포트 (인증 로직 간소화)
 import { authFetch } from '$lib/utils/authFetch'; 

 // CalendarForm에서 전달되는 payload 타입 정의
 interface EventPayload {
  title: string;
  emoji: string;
  startAt: string;
  endAt: string;
  description: string;
  visibility: 'public' | 'friends' | 'private';
  todos: { content: string; completed: boolean }[];
  imageUrl: string | null;
 }

 let eventData: Record<string, any> = {};
 let isLoggedIn = false;
 let isLoading = true;
 let loginMessage = '';

 onMount(async () => {
  const tokenState = get(auth);

  // 💡 [개선] 인증 체크 및 로그인 메시지 설정
  if (!tokenState?.access_token) {
   loginMessage = '로그인이 필요합니다.';
   isLoading = false;
   return;
  }

  isLoggedIn = true;
  const eventId = $page.params.eventId;
  
  // 💡 [개선] authFetch 사용
  try {
   const res = await authFetch(`/api/me/calendar/events/${eventId}`, {
    method: 'GET'
   });

   if (res.ok) {
    eventData = await res.json();
   } else if (res.status === 401) {
    loginMessage = '권한이 만료되었습니다. 다시 로그인해주세요.';
    clearAuth();
    userProfile.set(null);
    goto('/login'); // 401 발생 시 로그인 페이지로 이동
   } else if (res.status === 404) {
    loginMessage = '일정 정보를 찾을 수 없거나 접근 권한이 없습니다.';
   } else {
    loginMessage = '일정 정보를 불러오는 중 오류가 발생했습니다.';
   }
  } catch (err) {
   console.error("일정 로드 실패:", err);
   loginMessage = '서버 통신 중 오류가 발생했습니다.';
  } finally {
   isLoading = false;
  }
 });

 /**
  * 일정 수정 API 호출
  * @param event CalendarForm에서 전달된 CustomEvent<EventPayload>
  */
 async function handleSubmit(event: CustomEvent<EventPayload>) {
  console.log("dkdkdkdkk")
  const eventId = $page.params.eventId;
  const payload = event.detail;

  const tokenState = get(auth);

  if (!tokenState?.access_token) {
    alert('로그인이 필요합니다.');
    goto('/login');
    return;
  }

  // 💡 [개선] authFetch 사용 및 JSON 형식으로 전송
  try {
   const res = await authFetch(`/api/me/calendar/events/${eventId}`, {
    method: 'PUT',
    headers: { 
      Authorization: `Bearer ${tokenState.access_token}`,
      'Content-Type': 'application/json'
     },
    body: JSON.stringify(payload), // 💡 객체를 JSON 문자열로 변환
   });
   
   if (res.ok) {
    const currentProfile = get(userProfile);
    const nickname = currentProfile?.nickname || 'me'; // 닉네임이 없으면 'me' 또는 기본 경로로 대체
    await goto(`/profile/${nickname}`);
   
   } else if (res.status === 401) {
    loginMessage = '권한이 없습니다. 다시 로그인해주세요.';
    clearAuth();
    userProfile.set(null);
    goto('/login');
   } else {
    const errorData = await res.json().catch(() => ({ message: '알 수 없는 오류' }));
    alert(`수정 실패 : 서버 오류가 발생했습니다.`);
    console.error('Update failed:', errorData);
   }
  } catch (error) {
   alert('수정 중 : 네트워크 오류가 발생했습니다.');
   console.error("Network error during update:", error);
  }
 }

 function handleCancel() {
  // 💡 [개선] 취소 시 사용자 프로필 페이지로 리다이렉션
  const currentProfile = get(userProfile);
  const nickname = currentProfile?.nickname || 'me';
  goto(`/profile/${nickname}`);
 }
</script>

{#if isLoading}
  <LoadingSpinner message="일정 정보를 불러오는 중입니다..." />
{:else if !isLoggedIn || loginMessage}
  <LoginRequired message={loginMessage} />
{:else if Object.keys(eventData).length > 0}
  <CalendarForm
  {eventData}
  on:submit={handleSubmit}
  on:cancel={handleCancel}
 />
{:else}
  <LoginRequired message="일정 정보를 불러오지 못했습니다. 다시 시도해주세요." />
{/if}

<style>
 .loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  padding: 2rem;
  color: var(--text-primary);
 }

 .spinner {
  width: 3rem;
  height: 3rem;
  border: 4px solid var(--border-color);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
 }

 @keyframes spin {
  to { transform: rotate(360deg); }
 }
</style>