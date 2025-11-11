<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { page } from '$app/stores';
  import { auth } from '$lib/stores/auth';

  import Calendar from '$lib/components/common/calendar/Calendar.svelte';
  import FeedCard from '$lib/components/common/feed/FeedCard.svelte';
  import UserProfileHeader from '$lib/components/profile/UserProfileHeader.svelte';
  import LoadingSpinner from '$lib/components/common/loadingSpinner/LoadingSpinner.svelte';
  import type { UserProfile } from '$lib/types/profile';
  import type { CalendarEvent } from '$lib/types/calendar';

  let activeView: 'calendar' | 'feed' = 'calendar';
  $: userNickName = $page.params.userNickName ?? '';

  let profile: UserProfile | null = null;
  let isAuthValid = false;
  let isMyProfile = false;
  let isFollowing: boolean | null = null;
  let isLoadingProfile = true;

  let currentYear = new Date().getFullYear();
  let currentMonth = new Date().getMonth() + 1;

  let calendarData = { 
    events: [] as CalendarEvent[], 
    monthData: [] as number[][], 
    completionData: {} as Record<number, number> 
  };
  let isLoadingCalendar = false;
  let feedData: any[] = [];
  let isLoadingFeed = false;

  onMount(async () => {
    const token = get(auth)?.access_token;
    isAuthValid = !!token;

    await loadProfile();

    if (isAuthValid && get(auth)?.nickname === userNickName) {
      isMyProfile = true;
      isFollowing = null;
    } else if (isAuthValid) {
      isFollowing = await fetchIsFollowing(userNickName);
    }

    await loadCalendar();
  });

  async function loadProfile() {
    isLoadingProfile = true;
    try {
      const res = await fetch(`/api/profile/${userNickName}`);
      if (!res.ok) throw new Error('프로필 조회 실패');
      profile = await res.json();
    } catch (err) {
      console.error(err);
      profile = null;
    } finally {
      isLoadingProfile = false;
    }
  }

  async function fetchIsFollowing(nickname: string) {
    const token = get(auth)?.access_token;
    if (!token) return null;
    try {
      const res = await fetch(`/api/profile/${nickname}/follow-status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('팔로잉 여부 조회 실패');
      const data = await res.json();
      return data.is_following;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async function loadCalendar() {
    isLoadingCalendar = true;
    try {
      const token = get(auth)?.access_token;
      const isMine = token && get(auth)?.nickname === userNickName;
      let url = isMine ? `/api/calendar` : `/api/calendar/user/${userNickName}`;
      url += `?year=${currentYear}&month=${currentMonth}`;

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error('캘린더 조회 실패');

      const data = await res.json();
      calendarData = {
        events: data.events ?? [],
        monthData: data.monthData ?? [],
        completionData: data.completionData ?? {}
      };
    } catch (err) {
      console.error(err);
      calendarData = { events: [], monthData: [], completionData: {} };
    } finally {
      isLoadingCalendar = false;
    }
  }

  async function loadFeed() {
    isLoadingFeed = true;
    try {
      const res = await fetch(`/api/feeds/user/${userNickName}`);
      if (!res.ok) throw new Error('피드 조회 실패');
      feedData = await res.json();
    } catch (err) {
      console.error(err);
      feedData = [];
    } finally {
      isLoadingFeed = false;
    }
  }

  function handleTabChange(view: 'calendar' | 'feed') {
    activeView = view;
    if (view === 'calendar') {
      loadCalendar();
    } else {
      loadFeed();
    }
  }

  function changeMonth(offset: number) {
    currentMonth += offset;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    } else if (currentMonth < 1) {
      currentMonth = 12;
      currentYear--;
    }
    loadCalendar();
  }
</script>

<div class="container">
  <UserProfileHeader {profile} {isMyProfile} {isFollowing} isLoading={isLoadingProfile} />

  <div class="tabs">
    <button class:active={activeView === 'calendar'} on:click={() => handleTabChange('calendar')}>
      📅 캘린더
    </button>
    <button class:active={activeView === 'feed'} on:click={() => handleTabChange('feed')}>
      📰 피드
    </button>
  </div>

  {#if activeView === 'calendar'}
    <div class="month-controls">
      <button on:click={() => changeMonth(-1)}>◀ 이전</button>
      <span>{currentYear}년 {currentMonth}월</span>
      <button on:click={() => changeMonth(1)}>다음 ▶</button>
    </div>

    <div class="content">
      {#if isLoadingCalendar}
        <LoadingSpinner message="캘린더를 불러오는 중..." />
      {:else}
        <Calendar 
          events={calendarData.events}
          monthData={calendarData.monthData}
          completionData={calendarData.completionData}
        />
      {/if}
    </div>
  {/if}

  {#if activeView === 'feed'}
    <div class="content">
      {#if isLoadingFeed}
        <LoadingSpinner message="피드를 불러오는 중..." />
      {:else if feedData.length > 0}
        <div class="feed-list">
          {#each feedData as feed (feed.id)}
            <FeedCard {feed} />
          {/each}
        </div>
      {:else}
        <div class="empty-message">아직 작성된 피드가 없습니다.</div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .container {
    margin: 0 auto;
    min-height: 100vh;
  }
  
  .tabs {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .tabs button {
    flex: 1;
    padding: 0.75rem;
    border: none;
    background: var(--bg-secondary);
    cursor: pointer;
    border-radius: 0.5rem;
    transition: all 0.2s;
  }
  
  .tabs button.active {
    background: var(--accent-color);
    color: white;
    font-weight: bold;
  }
  
  .month-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin: 1rem 0;
  }
  
  .month-controls button {
    padding: 0.5rem 1rem;
    border: none;
    background: var(--bg-secondary);
    border-radius: 0.5rem;
    cursor: pointer;
  }
  
  .month-controls span {
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  .content {
    padding: 1rem;
  }
  
  .feed-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .empty-message {
    text-align: center;
    padding: 3rem 1rem;
    color: #666;
  }
</style>