<script lang="ts">
  import { goto } from '$app/navigation';
  import FeedCard from '$lib/components/common/feed/FeedCard.svelte';
  
  
  // 피드 데이터
  const feeds = [
    {
      id: 1,
      user: { name: '김민수', handle: '@minsu_dev', avatar: '👨‍💻' },
      date: '2시간 전',
      title: '오늘의 개발 목표 달성! 🎉',
      todos: [
        { text: 'React 컴포넌트 리팩토링', completed: true },
        { text: 'API 문서 작성', completed: true },
        { text: '코드 리뷰 3건 완료', completed: true }
      ],
      image: true,
      emoji: '💻',
      visibility: 'public',
      likes: 42,
      comments: 8,
      isLiked: false
    },
    {
      id: 2,
      user: { name: '박지은', handle: '@jieun_fit', avatar: '🏃‍♀️' },
      date: '5시간 전',
      title: '오늘의 운동 루틴',
      todos: [
        { text: '아침 러닝 5km', completed: true },
        { text: '플랭크 3분', completed: true },
        { text: '스쿼트 50개', completed: false }
      ],
      image: true,
      emoji: '💪',
      visibility: 'public',
      likes: 128,
      comments: 15,
      isLiked: true
    },
    {
      id: 3,
      user: { name: '이준호', handle: '@junho_reader', avatar: '📚' },
      date: '8시간 전',
      title: '이번 주 독서 계획',
      todos: [
        { text: '클린 코드 3장 읽기', completed: true },
        { text: '독서 노트 정리', completed: true },
        { text: '서평 작성하기', completed: true }
      ],
      image: false,
      emoji: '📖',
      visibility: 'friends',
      likes: 34,
      comments: 5,
      isLiked: false
    }
  ];

  let selectedFilter: 'all' | 'following' | 'popular' = 'all';

  function handleLike(event: CustomEvent) {
    console.log('좋아요:', event.detail.feedId);
  }

  function handleComment(event: CustomEvent) {
    goto(`/feed/${event.detail.feedId}`);
  }

  function handleBookmark(event: CustomEvent) {
    console.log('북마크:', event.detail.feedId);
  }

  function handleShare(event: CustomEvent) {
    console.log('공유:', event.detail.feedId);
  }

  function handleMore(event: CustomEvent) {
    console.log('더보기:', event.detail.feedId);
  }

</script>


  <!-- 메인 콘텐츠 -->
  <div class="main-container">
    <!-- 필터 탭 -->
    <div class="filter-tabs">
      <button 
        class="filter-tab"
        class:active={selectedFilter === 'all'}
        on:click={() => selectedFilter = 'all'}
      >
        전체
      </button>
      <button 
        class="filter-tab"
        class:active={selectedFilter === 'following'}
        on:click={() => selectedFilter = 'following'}
      >
        팔로잉
      </button>
      <button 
        class="filter-tab"
        class:active={selectedFilter === 'popular'}
        on:click={() => selectedFilter = 'popular'}
      >
        인기
      </button>
    </div>

    <!-- 피드 리스트 -->
    <div class="feed-list">
      {#each feeds as feed (feed.id)}
      <div class="feed-container">
          <FeedCard {feed} on:like on:comment on:bookmark on:share on:more />
        </div>
      {/each}
    </div>
</div>

<style>
  .main-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    flex: 1;
    border-right: 1px solid var(--border-light);
  }

  /* 필터 탭 */
  .filter-tabs {
    display: flex;
    border-bottom: 1px solid var(--border-light);
  }

  .filter-tab {
    flex: 1;
    padding: 1rem;
    border: none;
    background: none;
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
    border-bottom: 2px solid transparent;
  }

  .filter-tab.active {
    color: var(--color-primary);
    border-bottom-color: var(--color-primary);
  }

  .filter-tab:hover {
    background: var(--bg-secondary);
  }

  /* 피드 리스트 */
  .feed-list {
    display: flex;
    flex-direction: column;
  }

  .feed-container{
    padding: 10px;
  }  
</style>