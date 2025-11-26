<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
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
  import type { UserProfile } from '$lib/types/profile';
  import { auth } from '$lib/stores';
	import type { CalendarEvent } from '$lib/types/calendar';
  import { ArrowLeft, ArrowRight } from 'lucide-svelte'; // 아이콘 라이브러리 가정

  $: nickname = $page.params.nickname ?? '';

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
    profile = await loadProfile(nickname);

    // 로그인 및 내 프로필 판단
    const authData = get(auth);
    isMyProfile = authData?.nickname === nickname;
    isFollowing = isMyProfile ? null : (await fetchIsFollowing(nickname));

    // 캘린더 초기화
    isLoadingCalendar = true;
    // 초기 로드 시점의 currentYear/Month 사용
    const initialCalendar = await loadCalendar(nickname, currentYear, currentMonth);
    calendarData = {
      events: initialCalendar.events ?? [],
      monthData: initialCalendar.monthData ?? [[]],
      completionData: initialCalendar.completionData ?? {},
      year: initialCalendar.year ?? currentYear,
      month: initialCalendar.month ?? currentMonth,
    };
    isLoadingCalendar = false;

    isLoadingProfile = false;
  });

  // -----------------------------
  // 탭 변경
  // -----------------------------
  async function handleTabChange(view: 'calendar' | 'feed') {
    activeView = view;

    if (view === 'calendar' && isLoadingCalendar) { // 캘린더는 이미 onMount에서 로드됨
      // 이미 로드된 캘린더 데이터가 있으므로 다시 로드하지 않도록 로직 수정 가능
    } else if (view === 'feed' && feedData.length === 0) {
      isLoadingFeed = true;
      feedData = await loadFeed(nickname) ?? [];
      isLoadingFeed = false;
    }
  }

  // -----------------------------
  // 캘린더 월 변경
  // -----------------------------
  async function changeMonth(offset: number) {
    let newMonth = currentMonth + offset;
    let newYear = currentYear;
    
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }
    
    currentMonth = newMonth;
    currentYear = newYear;

    isLoadingCalendar = true;
    const newCalendar = await loadCalendar(nickname, currentYear, currentMonth);
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
  // TODO: 실제 구현 시 alert 대신 모달/토스트를 사용해야 합니다.
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
      // NOTE: Access Token은 Svelte Store나 HttpOnly Cookie에서 가져와야 안전하며,
      // localStorage 사용은 보안상 권장되지 않습니다. 이 예제에서는 기존 코드를 따랐습니다.
      const token = localStorage.getItem('access_token');
      const res = await fetch(`/api/me/calendar/events/${event.eventId}`, {
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

<div class={styles.container}>
  <UserProfileHeader 
    {profile} 
    isLoading={isLoadingProfile} 
    {isMyProfile} 
    {isFollowing} 
  />

  <div class={styles.tabsWrapper}>
    <div class={styles.tabs}>
      <button 
        class:active={activeView === 'calendar'} 
        on:click={() => handleTabChange('calendar')}
      >
        📅 캘린더
      </button>
      <button 
        class:active={activeView === 'feed'} 
        on:click={() => handleTabChange('feed')}
      >
        📰 피드
      </button>
    </div>
  </div>

  {#if activeView === 'calendar'}
    <div class={styles.monthControls}>
      <button class={styles.monthButton} on:click={() => changeMonth(-1)} aria-label="이전 달">
        <ArrowLeft size={20} />
      </button>
      <span class={styles.currentMonthLabel}>{currentYear}년 {currentMonth}월</span>
      <button class={styles.monthButton} on:click={() => changeMonth(1)} aria-label="다음 달">
        <ArrowRight size={20} />
      </button>
    </div>

    <div class={styles.content}>
      {#if isLoadingCalendar}
        <LoadingSpinner message="캘린더를 불러오는 중..." />
      {:else}
        <Calendar
          events={calendarData.events}
          monthData={calendarData.monthData}
          completionData={calendarData.completionData ?? {}}
          year={calendarData.year}
          month={calendarData.month}
          on:addEvent={handleAddEvent}
          on:editEvent={handleEditEvent}
          on:deleteEvent={handleDeleteEvent}
          on:daySelected={(e) => { /* daySelected 이벤트 처리 */ }}
        />
      {/if}
    </div>
  {/if}

  {#if activeView === 'feed'}
    <div class={styles.content}>
      {#if isLoadingFeed}
        <LoadingSpinner message={"피드를 불러오는 중..."} />
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
</div>