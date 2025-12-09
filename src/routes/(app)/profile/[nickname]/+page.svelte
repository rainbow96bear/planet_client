<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  import UserProfileHeader from '$lib/components/profile/UserProfileHeader.svelte';
  import Calendar from '$lib/components/common/calendar/Calendar.svelte';
  import FeedCard from '$lib/components/common/feed/FeedCard.svelte';
  import LoadingSpinner from '$lib/components/common/loadingSpinner/LoadingSpinner.svelte';

  import styles from './page.module.css';
  import { ArrowLeft, ArrowRight } from 'lucide-svelte';

  import {
    loadProfile,
    loadCalendar,
    loadFeed,
    fetchIsFollowing
  } from './page';

  import { user } from '$lib/stores';
	import type { CalendarData } from '$lib/types/calendar';

  // -----------------------------------
  // 기본 값
  // -----------------------------------
  $: nickname = $page.params.nickname ?? '';

  let profile: any = null;
  let isMyProfile = false;
  let isFollowing: boolean | null = null;

  let isLoadingProfile = true;
  let isLoadingCalendar = true;
  let isLoadingFeed = false;

  let feedData: any[] = [];
  let activeView: 'calendar' | 'feed' = 'calendar';

  let calendarData: CalendarData = {
    events: [],
    monthData: [[]],
    completionData: {},
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  };

  let currentYear = calendarData.year;
  let currentMonth = calendarData.month;

  // -----------------------------------
  // 초기 로드
  // -----------------------------------
  onMount(async () => {
    // 스토어에서 바로 구독
    const userData = $user;

    // 내 프로필인지 판별
    isMyProfile = userData?.nickname === nickname;

    // 팔로우 여부 (내 프로필 아닐 때만)
    if (!isMyProfile) {
      isFollowing = await fetchIsFollowing(nickname);
    }

    // 프로필 로드
    profile = await loadProfile(nickname, isMyProfile);
    isLoadingProfile = false;

    // 내 프로필이면 user 스토어 업데이트 (theme은 유지)
    if (isMyProfile) {
      user.update((u) => ({
        ...u,
        id: profile.id,
        nickname: profile.nickname,
        profileImage: profile.profileImage,
        bio: profile.bio,
        theme: u.theme
      }));
    }

    // 캘린더 데이터 로드
    calendarData = await loadCalendar(nickname, currentYear, currentMonth);
    isLoadingCalendar = false;
  });

  // -----------------------------------
  // 탭 변경
  // -----------------------------------
  async function handleTabChange(view: 'calendar' | 'feed') {
    activeView = view;

    if (view === 'feed' && feedData.length === 0) {
      isLoadingFeed = true;
      feedData = await loadFeed(nickname);
      isLoadingFeed = false;
    }
  }

  // -----------------------------------
  // 월 변경
  // -----------------------------------
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
    calendarData = await loadCalendar(nickname, currentYear, currentMonth);
    isLoadingCalendar = false;
  }

  // -----------------------------------
  // 캘린더 이벤트 핸들러
  // -----------------------------------
  function handleAddEvent(e: CustomEvent) {
    const { year, month, day } = e.detail;
    alert(`${year}년 ${month}월 ${day}일 일정 추가`);
  }

  function handleEditEvent(e: CustomEvent) {
    alert(`${e.detail.event.title} 일정 수정`);
  }

  async function handleDeleteEvent(e: CustomEvent) {
    const { event } = e.detail;

    if (!confirm(`"${event.title}" 일정을 삭제할까요?`)) return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("토큰 없음");

      const res = await fetch(`/api/me/calendar/events/${event.eventId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error();

      alert("삭제 완료");
      await changeMonth(0);
    } catch (err) {
      alert("삭제 실패");
    }
  }
</script>

<div class={styles.container}>
  <UserProfileHeader
    isLoading={isLoadingProfile}
    {isMyProfile}
    {isFollowing}
  />

  <!-- 탭 -->
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

  <!-- 캘린더 -->
  {#if activeView === 'calendar'}
    <div class={styles.monthControls}>
      <button class={styles.monthButton} on:click={() => changeMonth(-1)}>
        <ArrowLeft size={20} />
      </button>

      <span class={styles.currentMonthLabel}>
        {currentYear}년 {currentMonth}월
      </span>

      <button class={styles.monthButton} on:click={() => changeMonth(1)}>
        <ArrowRight size={20} />
      </button>
    </div>

    <div class={styles.content}>
      {#if isLoadingCalendar}
        <LoadingSpinner message="캘린더 불러오는 중..." />
      {:else}
        <Calendar
          events={calendarData.events}
          monthData={calendarData.monthData}
          completionData={calendarData.completionData}
          year={calendarData.year}
          month={calendarData.month}
          {nickname}
          on:addEvent={handleAddEvent}
          on:editEvent={handleEditEvent}
          on:deleteEvent={handleDeleteEvent}
        />
      {/if}
    </div>
  {/if}

  <!-- 피드 -->
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
</div>
