<script lang="ts">
  import { page } from '$app/stores';
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import NavigationBar from '$lib/components/sideBar/NavigationBar.svelte';
  import TrendingTags from '$lib/components/widget/TrendingTags.svelte';
  import '$lib/styles/themes.css';

  import styles from './layout.module.css';
  import { layoutState } from '$lib/stores/layoutState';
  import { derived } from 'svelte/store';
  import type { SuggestedUser, TrendingTag } from '$lib/types/layout';
	import { isLoggedIn } from '$lib/stores/auth';

  const suggestedUsers: SuggestedUser[] = [
    { name: '강하늘', handle: '@haneul_cook', avatar: '👨‍🍳', bio: '요리 블로거' },
    { name: '윤서아', handle: '@seoa_art', avatar: '🎨', bio: '일러스트레이터' },
    { name: '정우진', handle: '@woojin_music', avatar: '🎵', bio: '음악 프로듀서' },
    { name: '김태희', handle: '@taehee_yoga', avatar: '🧘‍♀️', bio: '요가 강사' },
    { name: '박준영', handle: '@junyoung_photo', avatar: '📷', bio: '사진작가' }
  ];

  const trendingTags: TrendingTag[] = [
    { tag: '운동루틴', count: 1100 },
    { tag: '독서챌린지', count: 856 },
    { tag: '요리일기', count: 742 },
    { tag: '코딩공부', count: 689 },
    { tag: '여행계획', count: 534 }
  ];
  const searchTag = (tag: string) => window.location.href = `/search?q=${encodeURIComponent(tag)}`;
  const followUser = (handle: string) => console.log('팔로우:', handle);
</script>

<div class={styles.layout}>
  <header class={styles.layoutHeader}>
    <Header/>
  </header>

  <main class={styles.layoutMain}>
    <aside class={styles.leftSidebar}>
      {#if $isLoggedIn}
        <NavigationBar currentPath={$layoutState.currentPath}/>
      {/if}
    </aside>

    <div class={styles.mainContent}>
      <slot />
    </div>

    <aside class={styles.rightSidebar}>
      <div class={styles.sidebarContent}>
        <TrendingTags trendingTags={trendingTags} onSelectTag={searchTag}/>
        <div class={styles.widgetSuggested}>
          <h2 class={styles.widgetTitle}>추천 친구</h2>
          <div class={styles.widgetContent}>
            {#each suggestedUsers as user}
              <div class={styles.suggestedUser}>
                <button class={styles.userMain} on:click={() => window.location.href=`/profile/${user.handle.replace('@','')}`}>
                  <div class={styles.userAvatar}>{user.avatar}</div>
                  <div class={styles.userInfo}>
                    <div class={styles.userName}>{user.name}</div>
                    <div class={styles.userBio}>{user.bio}</div>
                  </div>
                </button>
                <button class={styles.followBtn} on:click={() => followUser(user.handle)}>팔로우</button>
              </div>
            {/each}
          </div>
          <button class={styles.widgetMore}>더보기</button>
        </div>
      </div>
    </aside>
  </main>

  <footer class={styles.layoutFooter}>
    <Footer />
  </footer>
</div>
