<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { page } from '$app/stores';
  import { auth } from '$lib/stores/auth';

  import Calendar from '$lib/components/common/calendar/Calendar.svelte';
  import FeedCard from '$lib/components/common/feed/FeedCard.svelte';
  import UserProfileHeader from '$lib/components/profile/UserProfileHeader.svelte';
  import type { UserProfile } from '$lib/types/profile';
  import LoadingSpinner from '$lib/components/common/loadingSpinner/LoadingSpinner.svelte';

  let activeView: 'calendar' | 'feed' = 'calendar';
  $: userNickName = $page.params.userNickName ?? '';

  let profile: UserProfile | null = null;
  let isAuthValid = false;
  let isMyProfile = false;
  let isFollowing: boolean | null = null;
  let isLoadingProfile = true;

  let calendarData: {
    events: { id: number; title: string; start_at: string; end_at: string; visibility: 'public' | 'friends' | 'private'; emoji: string }[];
    monthData: (number | null)[][];
    completionData: Record<number, number>;
  } = { events: [], monthData: [], completionData: {} };

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

    if (activeView === 'calendar') await loadCalendar();
  });

  async function loadProfile() {
    isLoadingProfile = true;
    try {
      const res = await fetch(`/api/profile/${userNickName}`);
      if (!res.ok) throw new Error('프로필 조회 실패');
      profile = await res.json();
    } catch (err) {
      console.error('프로필 조회 오류:', err);
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
      const url = isMine ? `/api/calendar` : `/api/calendar/user/${userNickName}`;

      // TypeScript 안전하게 Headers 처리
      const headers = new Headers();
      if (token) headers.set('Authorization', `Bearer ${token}`);

      const res = await fetch(url, { headers });
      if (!res.ok) throw new Error('캘린더 조회 실패');
      const data = await res.json();
      console.log(data)
      const normalizedEvents = (data.events ?? []).map((e: any) => ({
        id: e.id,
        title: e.title ?? '제목 없음',
        start_at: e.start_at ?? e.startAt ?? '',
        end_at: e.end_at ?? e.endAt ?? '',
        visibility: e.visibility ?? e.visibility_type ?? 'public',
        emoji: e.emoji ?? '📅'
      }));

      calendarData = {
        events: normalizedEvents,
        monthData: data.monthData ?? generateEmptyMonthData(),
        completionData: data.completionData ?? {}
      };
    } catch (err) {
      console.error('캘린더 로드 오류:', err);
      calendarData = { events: [], monthData: generateEmptyMonthData(), completionData: {} };
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
      console.error('피드 로드 오류:', err);
      feedData = [];
    } finally {
      isLoadingFeed = false;
    }
  }

  function handleTabChange(view: 'calendar' | 'feed') {
    activeView = view;
    if (view === 'calendar') loadCalendar();
    else if (view === 'feed') loadFeed();
  }

  function generateEmptyMonthData() {
    const monthData = Array.from({ length: 5 }, () => Array(7).fill(null));
    let day = 1;
    for (let i = 0; i < monthData.length; i++) {
      for (let j = 0; j < 7; j++) {
        if (day <= 31) monthData[i][j] = day++;
      }
    }
    return monthData;
  }

  function handleLike(e: CustomEvent) { console.log('좋아요', e.detail); }
  function handleComment(e: CustomEvent) { console.log('댓글', e.detail); }
  function handleBookmark(e: CustomEvent) { console.log('북마크', e.detail); }
  function handleShare(e: CustomEvent) { console.log('공유', e.detail); }
  function handleMore(e: CustomEvent) { console.log('더보기', e.detail); }
</script>

<div class="container">
  <UserProfileHeader {profile} {isMyProfile} {isFollowing} isLoading={isLoadingProfile} />

  <div class="tabs">
    <button class="tab" class:active={activeView === 'calendar'} on:click={() => handleTabChange('calendar')}>
      캘린더
    </button>
    <button class="tab" class:active={activeView === 'feed'} on:click={() => handleTabChange('feed')}>
      피드
    </button>
  </div>

  {#if activeView === 'calendar'}
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
            <FeedCard {feed}
              on:like={handleLike}
              on:comment={handleComment}
              on:bookmark={handleBookmark}
              on:share={handleShare}
              on:more={handleMore}
            />
          {/each}
        </div>
      {:else}
        <div class="empty-message">아직 작성된 피드가 없습니다.</div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .container { flex: 1; margin: 0 auto; min-height: 100vh; }
  .tabs { background: var(--bg-primary); border-bottom: 1px solid var(--border-color); display: flex; position: sticky; top: 0; z-index: 20; }
  .tab { flex: 1; padding: 0.75rem; border: none; background: none; font-size: 0.875rem; font-weight: 600; color: var(--text-tertiary); cursor: pointer; transition: all 0.2s; border-bottom: 2px solid transparent; }
  .tab.active { color: var(--color-primary); border-bottom-color: var(--color-primary); }
  .content { padding: 1rem; }
  .feed-list { display: flex; flex-direction: column; gap: 1rem; }
  .loading-message, .empty-message { text-align: center; padding: 3rem 1rem; color: var(--text-secondary); font-size: 0.9375rem; }
</style>
