<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { get, writable } from 'svelte/store';
  import UserProfileHeader from '$lib/components/profile/UserProfileHeader.svelte';
  import Calendar from '$lib/components/common/calendar/Calendar.svelte';
  import FeedCard from '$lib/components/common/feed/FeedCard.svelte';
  import LoadingSpinner from '$lib/components/common/loadingSpinner/LoadingSpinner.svelte';
  import styles from './page.module.css';

  import { 
    loadProfile, 
    fetchIsFollowing, 
    loadCalendar, 
    loadFeed
  } from './page';
  import type { ProfileState, UserProfile } from '$lib/types/profile';
  import { auth, profileState } from '$lib/stores';
	import type { CalendarEvent } from '$lib/types/calendar';

  $: userNickName = $page.params.userNickName ?? '';

  // -----------------------------
  // state 정의
  // -----------------------------
  let profile: UserProfile | null = null;
  let isLoadingProfile = true;
  let isMyProfile = false;
  let isFollowing: boolean | null = null;

  let calendarData: {
    events: CalendarEvent[];
    monthData: (number | null)[][];
    completionData: Record<number, number>;
    year: number;
    month: number;
  } = {
    events: [],
    monthData: [[]],
    completionData: {},
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  };

  let feedData: any[] = [];
  let isLoadingCalendar = true;
  let isLoadingFeed = false;

  let currentYear = calendarData.year;
  let currentMonth = calendarData.month;

  let activeView: 'calendar' | 'feed' = 'calendar';

  // -----------------------------
  // 초기 로드
  // -----------------------------
  onMount(async () => {
    isLoadingProfile = true;

    // 프로필 불러오기
    profile = await loadProfile(userNickName);

    // 로그인 및 내 프로필 판단
    const authData = get(auth);
    isMyProfile = authData?.nickname === userNickName;
    isFollowing = isMyProfile ? null : (await fetchIsFollowing(userNickName));

    // 캘린더 초기화
    isLoadingCalendar = true;
    const initialCalendar = await loadCalendar(userNickName, currentYear, currentMonth);
    calendarData = {
      events: initialCalendar.events ?? [],
      monthData: initialCalendar.monthData ?? [[]],
      completionData: initialCalendar.completionData ?? {},
      year: initialCalendar.year ?? currentYear,
      month: initialCalendar.month ?? currentMonth,
    };
    console.log(calendarData.events)
    isLoadingCalendar = false;

    isLoadingProfile = false;
  });

  // -----------------------------
  // 탭 변경
  // -----------------------------
  async function handleTabChange(view: 'calendar' | 'feed') {
    activeView = view;

    if (view === 'calendar') {
      isLoadingCalendar = true;
      const newCalendar = await loadCalendar(userNickName, currentYear, currentMonth);
      calendarData = {
        events: newCalendar.events ?? [],
        monthData: newCalendar.monthData ?? [[]],
        completionData: newCalendar.completionData ?? {},
        year: newCalendar.year ?? currentYear,
        month: newCalendar.month ?? currentMonth,
      };
      isLoadingCalendar = false;
    } else {
      isLoadingFeed = true;
      feedData = await loadFeed(userNickName) ?? [];
      isLoadingFeed = false;
    }
  }

  // -----------------------------
  // 캘린더 월 변경
  // -----------------------------
  async function changeMonth(offset: number) {
    currentMonth += offset;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    } else if (currentMonth < 1) {
      currentMonth = 12;
      currentYear--;
    }

    isLoadingCalendar = true;
    const newCalendar = await loadCalendar(userNickName, currentYear, currentMonth);
    calendarData = {
      events: newCalendar.events ?? [],
      monthData: newCalendar.monthData ?? [[]],
      completionData: newCalendar.completionData ?? {},
      year: newCalendar.year ?? currentYear,
      month: newCalendar.month ?? currentMonth,
    };
    isLoadingCalendar = false;
  }

  // -----------------------------
  // 캘린더 이벤트 핸들러
  // -----------------------------
  function handleAddEvent(e: CustomEvent) {
    const { year, month, day } = e.detail;
    alert(`${year}년 ${month}월 ${day}일에 새 일정을 추가합니다.`);
  }

  function handleEditEvent(e: CustomEvent) {
    const { event } = e.detail;
    alert(`"${event.title}" 일정을 수정합니다.`);
  }

  async function handleDeleteEvent(e: CustomEvent) {
    const { event } = e.detail;
    if (!confirm(`"${event.title}" 일정을 삭제하시겠습니까?`)) return;

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`/api/calendar/${event.eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('일정 삭제 실패');

      alert('일정이 삭제되었습니다.');
      await changeMonth(0); // 현재 달 다시 불러오기
    } catch (err) {
      console.error(err);
      alert('일정 삭제에 실패했습니다.');
    }
  }
</script>

<!-- -----------------------------
     프로필 헤더
----------------------------- -->
<UserProfileHeader 
  {profile} 
  isLoading={isLoadingProfile} 
  {isMyProfile} 
  {isFollowing} 
/>

<!-- -----------------------------
     탭
----------------------------- -->
<div class={styles.tabs}>
  <button class:active={activeView === 'calendar'} on:click={() => handleTabChange('calendar')}>📅 캘린더</button>
  <button class:active={activeView === 'feed'} on:click={() => handleTabChange('feed')}>📰 피드</button>
</div>

<!-- -----------------------------
     캘린더
----------------------------- -->
{#if activeView === 'calendar'}
  <div class={styles.monthControls}>
    <button on:click={() => changeMonth(-1)}>◀ 이전</button>
    <span>{currentYear}년 {currentMonth}월</span>
    <button on:click={() => changeMonth(1)}>다음 ▶</button>
  </div>

  <div class={styles.content}>
    {#if isLoadingCalendar}
      <LoadingSpinner message="캘린더를 불러오는 중..." />
    {:else}
      <Calendar
        events={calendarData.events}
        monthData={calendarData.monthData}
        completionData={calendarData.completionData}\
        year={calendarData.year}
        month={calendarData.month}
        on:addEvent={handleAddEvent}
        on:editEvent={handleEditEvent}
        on:deleteEvent={handleDeleteEvent}
      />
    {/if}
  </div>
{/if}

<!-- -----------------------------
     피드
----------------------------- -->
{#if activeView === 'feed'}
  <div class={styles.content}>
    {#if isLoadingFeed}
      <LoadingSpinner message="피드를 불러오는 중..." />
    {:else if feedData.length > 0}
      <div class={styles.feedList}>
        {#each feedData as feed (feed.id)}
          <FeedCard {feed} />
        {/each}
      </div>
    {:else}
      <div class={styles.emptyMessage}>아직 작성된 피드가 없습니다.</div>
    {/if}
  </div>
{/if}
