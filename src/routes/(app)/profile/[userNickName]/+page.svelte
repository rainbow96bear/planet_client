<script lang="ts">
	import Calender from '$lib/components/common/calender/Calender.svelte';
	import FeedCard from '$lib/components/common/feed/FeedCard.svelte';
  
  let activeView: 'calendar' | 'feed' = 'calendar';
  
  // 일정 데이터
  const events = [
    { id: 1, title: '제주도 여행', start: 13, end: 15, visibility: 'public', emoji: '🏝️' },
    { id: 2, title: '프로젝트 마감', start: 10, end: 12, visibility: 'friends', emoji: '💼' },
    { id: 3, title: '운동', start: 16, end: 16, visibility: 'public', emoji: '💪' },
    { id: 4, title: '독서 챌린지', start: 1, end: 30, visibility: 'private', emoji: '📚' },
  ];
  
  // 월간 데이터
  const monthData = [
    [null, null, null, null, 1, 2, 3],
    [4, 5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24],
    [25, 26, 27, 28, 29, 30, 31]
  ];
  
  // 완료율 데이터
  const completionData: Record<number, number> = {
    1: 20, 2: 20, 3: 20, 10: 100, 11: 80, 12: 90, 13: 100, 14: 100, 15: 100,
    16: 100, 18: 100, 20: 100, 21: 50, 22: 100, 23: 60, 25: 80, 26: 70, 27: 60
  };
  
  const feeds = [
    {
      id: 1,
      user: { name: '박지은', handle: '@jieun_fit', avatar: '🏃‍♀️' },
      date: '10월 25-27일',
      title: '부산 출장',
      todos: [
        { text: '호텔 예약 완료', completed: true },
        { text: '업무 미팅 3건', completed: true },
        { text: '맛집 투어', completed: false }
      ],
      image: true,
      visibility: 'public',
      likes: 42,
      comments: 12,
      emoji: '🚄'
    },
    {
      id: 2,
      user: { name: '박지은', handle: '@jieun_fit', avatar: '🏃‍♀️' },
      date: '10월 22일',
      title: '오늘의 운동',
      todos: [
        { text: '아침 러닝 5km', completed: true },
        { text: '근력 운동 1시간', completed: true },
      ],
      visibility: 'public',
      likes: 28,
      comments: 5,
      emoji: '💪'
    }
  ];
</script>

<div class="container">
  <!-- 프로필 헤더 -->
  <div class="profile-header">
    <div class="bg-decoration decoration-1"></div>
    <div class="bg-decoration decoration-2"></div>
    
    <div class="header-content">
      <div class="profile-info">
        <div class="avatar">
          <span class="avatar-emoji">🪐</span>
        </div>
        <div class="user-info">
          <h1 class="username">김지현</h1>
          <p class="handle">@jihyun_daily</p>
        </div>
      </div>
      
      <div class="stats">
        <div class="stat-item">
          <div class="stat-value">247</div>
          <div class="stat-label">팔로워</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">189</div>
          <div class="stat-label">팔로잉</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">24</div>
          <div class="stat-label">이번 달</div>
        </div>
      </div>
    </div>
  </div>

  <!-- 탭 네비게이션 -->
  <div class="tabs">
    <button
      class="tab"
      class:active={activeView === 'calendar'}
      on:click={() => activeView = 'calendar'}
    >
      캘린더
    </button>
    <button
      class="tab"
      class:active={activeView === 'feed'}
      on:click={() => activeView = 'feed'}
    >
      피드
    </button>
  </div>

  <!-- 캘린더 뷰 -->
  {#if activeView === 'calendar'}
    <Calender {events} {monthData} {completionData}></Calender>
  {/if}

  <!-- 피드 뷰 -->
  {#if activeView === 'feed'}
    <div class="content">
      <div class="feed-list">
        {#each feeds as feed}
          <FeedCard {feed} on:like on:comment on:bookmark on:share on:more />
        {/each}
      </div>
    </div>
  {/if}
</div>

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

  /* 반응형 */
  @media (max-width: 768px) {
    .container {
      max-width: 100%;
      padding: 0 1rem;
    }

    .stats {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>