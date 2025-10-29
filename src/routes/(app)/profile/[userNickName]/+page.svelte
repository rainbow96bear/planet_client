<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { auth } from '$lib/stores/auth';
  import Calendar from '$lib/components/common/calendar/Calendar.svelte';
  import FeedCard from '$lib/components/common/feed/FeedCard.svelte';
	import type { UserProfile } from '$lib/types/profile';
	import UserProfileHeader from '$lib/components/profile/UserProfileHeader.svelte';
  
  let activeView: 'calendar' | 'feed' = 'calendar';
  $: userNickName = $page.params.userNickName ?? "";
  
  // 프로필 데이터
  let profile: UserProfile|null = null;
  let isAuthValid = false;
  let isMyProfile = false;
  let isFollowing: boolean | null = null;
  let isLoadingProfile = true;
  
  // 캘린더 데이터
  let calendarData: any = null;
  let isLoadingCalendar = false;
  let calendarLoaded = false; // 캐싱 플래그
  
  // 피드 데이터
  let feedData: any[] = [];
  let isLoadingFeed = false;
  let feedLoaded = false; // 캐싱 플래그
  
  onMount(async () => {
    loadProfile();
    // 첫 로드 시 캘린더 자동 로드
    // loadCalendar();

    if (isAuthValid && $auth.nickname === userNickName) {
      isMyProfile = true;
      isFollowing = null;
    }
    // 다른 유저 프로필이면 팔로잉 여부 확인
    else if (isAuthValid) {
      isFollowing = await fetchIsFollowing(userNickName);
    }
    // 비로그인
    else {
      isFollowing = null;
    }
  });
  
  // 프로필 정보 로드
  async function loadProfile() {
    isLoadingProfile = true;
    try {
      const res = await fetch(`/api/profile/${userNickName}`);
      if (res.ok) {
        const data = await res.json();
        profile = data.profile;
      } else {
        console.error('프로필 조회 실패:', res.status);
      }
    } catch (err) {
      console.error('프로필 정보 조회 오류:', err);
    } finally {
      isLoadingProfile = false;
    }
  }
  
  async function fetchIsFollowing(nickname: string) {
    const tokenState = get(auth);
    try {
      const res = await fetch(`/api/profile/${nickname}/follow-status`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenState.access_token}`
        }
      });
      if (!res.ok) throw new Error('팔로잉 여부를 확인할 수 없습니다.');
      const data = await res.json();
      return data.is_following;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  // 캘린더 데이터 로드
  async function loadCalendar() {
    // 이미 로드된 경우 재요청 방지 (캐싱)
    if (calendarLoaded) return;
    
    isLoadingCalendar = true;
    try {
      const res = await fetch(`/api/profile/${userNickName}/calendar`);
      if (res.ok) {
        calendarData = await res.json();
        calendarLoaded = true; // 캐싱 플래그 설정
      } else {
        console.error('캘린더 조회 실패:', res.status);
      }
    } catch (err) {
      console.error('캘린더 조회 오류:', err);
    } finally {
      isLoadingCalendar = false;
    }
  }
  
  // 피드 데이터 로드
  async function loadFeed() {
    // 이미 로드된 경우 재요청 방지 (캐싱)
    if (feedLoaded) return;
    
    isLoadingFeed = true;
    try {
      const res = await fetch(`/api/profile/${userNickName}/feeds`);
      if (res.ok) {
        feedData = await res.json();
        feedLoaded = true; // 캐싱 플래그 설정
      } else {
        console.error('피드 조회 실패:', res.status);
      }
    } catch (err) {
      console.error('피드 조회 오류:', err);
    } finally {
      isLoadingFeed = false;
    }
  }
  
  // 탭 전환 시 데이터 로드
  function handleTabChange(view: 'calendar' | 'feed') {
    activeView = view;
    
    // 선택된 탭의 데이터가 아직 로드되지 않은 경우에만 로드
    if (view === 'calendar' && !calendarLoaded) {
      loadCalendar();
    } else if (view === 'feed' && !feedLoaded) {
      loadFeed();
    }
  }
  
  // 피드 이벤트 핸들러
  function handleLike(event: CustomEvent) {
    console.log('좋아요:', event.detail);
    // TODO: 좋아요 API 호출
  }
  
  function handleComment(event: CustomEvent) {
    console.log('댓글:', event.detail);
    // TODO: 댓글 페이지로 이동
  }
  
  function handleBookmark(event: CustomEvent) {
    console.log('북마크:', event.detail);
    // TODO: 북마크 API 호출
  }
  
  function handleShare(event: CustomEvent) {
    console.log('공유:', event.detail);
    // TODO: 공유 기능
  }
  
  function handleMore(event: CustomEvent) {
    console.log('더보기:', event.detail);
    // TODO: 더보기 메뉴
  }

  // $: isMyProfile = $page.params.nickname === $auth.nickname;
</script>

<div class="container">
  <!-- 프로필 헤더 -->
  <UserProfileHeader {profile} {isMyProfile} {isFollowing} isLoading={isLoadingProfile} />

  <!-- 탭 네비게이션 -->
  <div class="tabs">
    <button
      class="tab"
      class:active={activeView === 'calendar'}
      on:click={() => handleTabChange('calendar')}
    >
      캘린더
    </button>
    <button
      class="tab"
      class:active={activeView === 'feed'}
      on:click={() => handleTabChange('feed')}
    >
      피드
    </button>
  </div>

  <!-- 캘린더 뷰 -->
  {#if activeView === 'calendar'}
    <div class="content">
      {#if isLoadingCalendar}
        <div class="loading-message">캘린더를 불러오는 중...</div>
      {:else if calendarData}
        <Calendar 
          events={calendarData.events}
          monthData={calendarData.monthData}
          completionData={calendarData.completionData}
        />
      {:else}
        <div class="empty-message">캘린더 데이터가 없습니다.</div>
      {/if}
    </div>
  {/if}

  <!-- 피드 뷰 -->
  {#if activeView === 'feed'}
    <div class="content">
      {#if isLoadingFeed}
        <div class="loading-message">피드를 불러오는 중...</div>
      {:else if feedData.length > 0}
        <div class="feed-list">
          {#each feedData as feed (feed.id)}
            <FeedCard 
              {feed} 
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

<!-- 더미 데이터 (개발용) -->
<!-- 
<script lang="ts">
  // 더미 데이터
  const dummyEvents = [
    { id: 1, title: '제주도 여행', start: 13, end: 15, visibility: 'public', emoji: '🏝️' },
    { id: 2, title: '프로젝트 마감', start: 10, end: 12, visibility: 'friends', emoji: '💼' },
  ];
  
  const dummyMonthData = [
    [null, null, null, null, 1, 2, 3],
    [4, 5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24],
    [25, 26, 27, 28, 29, 30, 31]
  ];
  
  const dummyCompletionData = {
    1: 20, 2: 20, 3: 20, 10: 100, 11: 80, 12: 90,
  };
  
  const dummyFeeds = [
    {
      id: 1,
      user: { name: '박지은', handle: '@jieun_fit', avatar: '🏃‍♀️' },
      date: '10월 25-27일',
      title: '부산 출장',
      todos: [
        { text: '호텔 예약 완료', completed: true },
        { text: '업무 미팅 3건', completed: true },
      ],
      image: true,
      visibility: 'public',
      likes: 42,
      comments: 12,
      emoji: '🚄'
    }
  ];
</script>
-->

<style>
  .container {
    flex: 1;
    margin: 0 auto;
    min-height: 100vh;
  }

  /* 탭 */
  .tabs {
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-color);
    display: flex;
    position: sticky;
    top: 0;
    z-index: 20;
  }

  .tab {
    flex: 1;
    padding: 0.75rem;
    border: none;
    background: none;
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-tertiary);
    cursor: pointer;
    transition: all 0.2s;
    border-bottom: 2px solid transparent;
  }

  .tab.active {
    color: var(--color-primary);
    border-bottom-color: var(--color-primary);
  }

  /* 콘텐츠 */
  .content {
    padding: 1rem;
  }

  /* 피드 */
  .feed-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* 로딩 & 에러 메시지 */
  .loading-message,
  .empty-message{
    text-align: center;
    padding: 3rem 1rem;
    color: var(--text-secondary);
    font-size: 0.9375rem;
  }

  /* 반응형 */
  @media (max-width: 768px) {
    .container {
      max-width: 100%;
    }
  }
</style>