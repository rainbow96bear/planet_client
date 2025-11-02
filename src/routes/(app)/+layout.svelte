<script lang="ts">
  import '$lib/styles/themes.css';
  import { onMount } from 'svelte';
  import { auth, isAccessTokenValid } from '$lib/stores/auth';
  import { theme } from '$lib/stores/theme';
  import { userProfile } from '$lib/stores/myProfile';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import NavigationBar from '$lib/components/sideBar/NavigationBar.svelte';
  import TrendingTags from '$lib/components/widget/TrendingTags.svelte';

  let isLoggedIn = false;
  $: currentPath = $page.url.pathname;

  // -------------------------------
  //  추천 유저 및 트렌드 태그 더미 데이터
  // -------------------------------
  const suggestedUsers = [
    { name: '강하늘', handle: '@haneul_cook', avatar: '👨‍🍳', bio: '요리 블로거' },
    { name: '윤서아', handle: '@seoa_art', avatar: '🎨', bio: '일러스트레이터' },
    { name: '정우진', handle: '@woojin_music', avatar: '🎵', bio: '음악 프로듀서' },
    { name: '김태희', handle: '@taehee_yoga', avatar: '🧘‍♀️', bio: '요가 강사' },
    { name: '박준영', handle: '@junyoung_photo', avatar: '📷', bio: '사진작가' }
  ];

  const trendingTags = [
    { tag: '운동루틴', count: 1100 },
    { tag: '독서챌린지', count: 856 },
    { tag: '요리일기', count: 742 },
    { tag: '코딩공부', count: 689 },
    { tag: '여행계획', count: 534 }
  ];

  // -------------------------------
  //  공통 함수
  // -------------------------------
  const searchTag = (tag: string) => goto(`/search?q=${encodeURIComponent(tag)}`);
  const followUser = (handle: string) => console.log('팔로우:', handle);

  onMount(() => {
    const unsubscribe = auth.subscribe(async (tokenState) => {
      const token = tokenState?.access_token;
      isLoggedIn = !!token && isAccessTokenValid();

      if (!isLoggedIn) {
        theme.setTheme('light');
        userProfile.set(null);
        return;
      }

      try {
        const res = await fetch('/api/profile/me',{
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          userProfile.set(data);
        } else {
          userProfile.set(null);
        }
      } catch (err) {
        console.error('유저 정보 로드 실패:', err);
        userProfile.set(null);
      }

      try {
        const res = await fetch('/api/user/theme', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          theme.setTheme(data.theme);
        } else {
          theme.setTheme('light');
        }
      } catch {
        theme.setTheme('light');
      }
    });

    return () => unsubscribe();
  });
</script>

<div class="layout">
  <header class="layout-header">
    <Header {isLoggedIn} />
  </header>

  <main class="layout-main">
    <aside class="left-sidebar">
      {#if isLoggedIn && $userProfile}
        <NavigationBar {currentPath} {isLoggedIn} profile={$userProfile} />
      {/if}
    </aside>

    <div class="main-content">
      <slot />
    </div>

    <aside class="right-sidebar">
      <div class="sidebar-content">
        <TrendingTags {trendingTags} onSelectTag={searchTag} />

        <div class="widget suggested-widget">
          <h2 class="widget-title">추천 친구</h2>
          <div class="widget-content">
            {#each suggestedUsers as user}
              <div class="suggested-user">
                <button
                  class="user-main"
                  on:click={() => goto(`/profile/${user.handle.replace('@', '')}`)}
                >
                  <div class="user-avatar-small">{user.avatar}</div>
                  <div class="user-info-small">
                    <div class="user-name-small">{user.name}</div>
                    <div class="user-bio">{user.bio}</div>
                  </div>
                </button>
                <button
                  class="follow-btn-small"
                  on:click={() => followUser(user.handle)}
                >
                  팔로우
                </button>
              </div>
            {/each}
          </div>
          <button class="widget-more">더보기</button>
        </div>
      </div>
    </aside>
  </main>

  <footer class="layout-footer">
    <Footer />
  </footer>
</div>

<style>
  .layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .layout-header,
  .layout-footer {
    flex: 0 0 auto;
  }

  .layout-main {
    display: flex;
    flex: 1 1 auto;
  }

  .left-sidebar {
    width: 280px;
    border-right: 1px solid var(--border-light);
    overflow-y: auto;
  }

  .main-content {
    flex: 1 1 auto;
    min-height: 100%;
    border-left: 1px solid var(--border-light);
    border-right: 1px solid var(--border-light);
    overflow-y: auto;
  }

  .right-sidebar {
    width: 340px;
    border-right: 1px solid var(--border-light);
    overflow-y: auto;
  }

  /* 반응형 */
  @media (max-width: 1280px) {
    .left-sidebar { width: 240px; }
    .right-sidebar { width: 300px; }
  }

  @media (max-width: 1024px) {
    .left-sidebar { width: 200px; }
    .right-sidebar { display: none; }
    .main-content { border-right: none; }
  }

  @media (max-width: 768px) {
    .left-sidebar { display: none; }
    .main-content {
      flex: 1 1 100%;
      width: 100%;
      border: none;
    }
  }

  /* 위젯 영역 */
  .sidebar-content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .widget {
    background: var(--bg-primary);
    border-radius: 1rem;
    border: 1px solid var(--border-light);
    margin-bottom: 1rem;
    overflow: hidden;
  }

  .widget-title {
    font-size: 1.125rem;
    font-weight: bold;
    color: var(--text-primary);
    padding: 1rem 1rem 0.75rem;
    margin: 0;
  }

  .widget-more {
    width: 100%;
    padding: 1rem;
    border: none;
    background: none;
    color: var(--color-primary);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    border-top: 1px solid var(--border-light);
  }

  .suggested-user {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.875rem 1rem;
    transition: background 0.2s;
  }

  .suggested-user:hover {
    background: var(--bg-secondary);
  }

  .user-main {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    border: none;
    background: none;
    cursor: pointer;
    text-align: left;
    padding: 0;
  }

  .user-avatar-small {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .user-name-small {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .user-bio {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }

  .follow-btn-small {
    padding: 0.375rem 0.875rem;
    border-radius: 1rem;
    border: none;
    background: var(--text-primary);
    color: var(--bg-primary);
    font-size: 0.8125rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .follow-btn-small:hover {
    opacity: 0.9;
  }
</style>
