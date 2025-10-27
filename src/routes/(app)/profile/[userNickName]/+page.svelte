<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { auth } from '$lib/stores/auth';
  import Calender from '$lib/components/common/calender/Calender.svelte';
  import FeedCard from '$lib/components/common/feed/FeedCard.svelte';
  
  let activeView: 'calendar' | 'feed' = 'calendar';
  let userNickName: string;
  
  // 프로필 데이터
  let profileData: any = null;
  let isLoadingProfile = true;
  
  // 캘린더 데이터
  let calendarData: any = null;
  let isLoadingCalendar = false;
  let calendarLoaded = false; // 캐싱 플래그
  
  // 피드 데이터
  let feedData: any[] = [];
  let isLoadingFeed = false;
  let feedLoaded = false; // 캐싱 플래그
  
  onMount(() => {
    userNickName = $page.params.userNickName;
    loadProfile();
    // 첫 로드 시 캘린더 자동 로드
    loadCalendar();
  });
  
  // 프로필 정보 로드
  async function loadProfile() {
    isLoadingProfile = true;
    try {
      const res = await fetch(`/api/profile/${userNickName}`);
      if (res.ok) {
        profileData = await res.json();
      } else {
        console.error('프로필 조회 실패:', res.status);
      }
    } catch (err) {
      console.error('프로필 정보 조회 오류:', err);
    } finally {
      isLoadingProfile = false;
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
      const res = await fetch(`/api/profile/${userNickName}/feed`);
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

  $: isMyProfile = $page.params.nickname === $auth.nickname;
</script>

<div class="container">
  <!-- 프로필 헤더 -->
  {#if isLoadingProfile}
    <div class="profile-header loading">
      <div class="loading-spinner">로딩 중...</div>
    </div>
  {:else if profileData}
    <div class="profile-header">
      <div class="bg-decoration decoration-1"></div>
      <div class="bg-decoration decoration-2"></div>
      
      <div class="header-content">
        <div class="profile-info">
          <div class="avatar">
            <span class="avatar-emoji">{profileData.avatar || '🪐'}</span>
          </div>
          <div class="user-info">
            <h1 class="username">{profileData.name}</h1>
            <p class="handle">@{profileData.nickname}</p>
          </div>
        </div>
        
        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">{profileData.followerCount || 0}</div>
            <div class="stat-label">팔로워</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{profileData.followingCount || 0}</div>
            <div class="stat-label">팔로잉</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{profileData.monthlyEventCount || 0}</div>
            <div class="stat-label">이번 달</div>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div class="error-message">프로필을 불러올 수 없습니다.</div>
  {/if}

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
        <Calender 
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

  /* 프로필 헤더 */
  .profile-header {
    padding: 1.5rem;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    box-shadow: var(--shadow-lg);
    position: relative;
    overflow: hidden;
  }

  .profile-header.loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 12rem;
  }

  .loading-spinner {
    color: white;
    font-size: 1rem;
  }

  .bg-decoration {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }

  .decoration-1 {
    top: 0;
    right: 0;
    width: 10rem;
    height: 10rem;
    background: rgba(255, 255, 255, 0.1);
    filter: blur(60px);
  }

  .decoration-2 {
    bottom: 0;
    left: 0;
    width: 8rem;
    height: 8rem;
    background: rgba(255, 255, 255, 0.05);
    filter: blur(40px);
  }

  .header-content {
    position: relative;
    z-index: 10;
  }

  .profile-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .avatar {
    width: 5rem;
    height: 5rem;
    border-radius: 50%;
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-xl);
  }

  .avatar-emoji {
    font-size: 2rem;
  }

  .user-info {
    flex: 1;
  }

  .username {
    font-size: 1.25rem;
    font-weight: bold;
    color: white;
    margin: 0 0 0.25rem 0;
  }

  .handle {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
  }

  .stats {
    display: flex;
    justify-content: space-around;
    text-align: center;
  }

  .stat-item {
    flex: 1;
  }

  .stat-value {
    font-size: 1.125rem;
    font-weight: bold;
    color: white;
  }

  .stat-label {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 0.25rem;
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
  .empty-message,
  .error-message {
    text-align: center;
    padding: 3rem 1rem;
    color: var(--text-secondary);
    font-size: 0.9375rem;
  }

  .error-message {
    color: #EF4444;
    background: var(--bg-primary);
    padding: 2rem 1rem;
  }

  /* 반응형 */
  @media (max-width: 768px) {
    .container {
      max-width: 100%;
    }

    .profile-header {
      padding: 1rem;
    }
  }
</style>