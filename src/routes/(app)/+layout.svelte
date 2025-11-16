<script lang="ts">
  import { page } from '$app/stores';
  import { profileState } from '$lib/stores/profileState';
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import NavigationBar from '$lib/components/sideBar/NavigationBar.svelte';
  import TrendingTags from '$lib/components/widget/TrendingTags.svelte';
  import '$lib/styles/themes.css';

  import styles from './layout.module.css';
  import { initLayout, suggestedUsers, trendingTags, type LayoutState } from './layout';
  import { writable, derived } from 'svelte/store';

  // -----------------------------
  // layoutState 관리
  // -----------------------------
  const layoutState = writable<LayoutState>({
    isLoggedIn: false,
    currentPath: '',
    suggestedUsers,
    trendingTags
  });
  
  const currentPathStore = derived(page, $page => $page.url.pathname);
  
  initLayout(currentPathStore, (partial) =>
    layoutState.update(s => ({ ...s, ...partial }))
  );

  let state: LayoutState;
  layoutState.subscribe(v => state = v);

  const searchTag = (tag: string) => window.location.href = `/search?q=${encodeURIComponent(tag)}`;
  const followUser = (handle: string) => console.log('팔로우:', handle);
</script>

<div class={styles.layout}>
  <header class={styles.layoutHeader}>
    <Header isLoggedIn={state.isLoggedIn} profile={$profileState?.profile ?? null}/>
  </header>

  <main class={styles.layoutMain}>
    <aside class={styles.leftSidebar}>
      {#if $layoutState.isLoggedIn && $profileState}
        <NavigationBar currentPath={$layoutState.currentPath} isLoggedIn={$layoutState.isLoggedIn} profile={$profileState?.profile} />
      {/if}
    </aside>

    <div class={styles.mainContent}>
      <slot />
    </div>

    <aside class={styles.rightSidebar}>
      <div class={styles.sidebarContent}>
        <TrendingTags trendingTags={state.trendingTags} onSelectTag={searchTag}/>

        <div class={styles.widgetSuggested}>
          <h2 class={styles.widgetTitle}>추천 친구</h2>
          <div class={styles.widgetContent}>
            {#each state.suggestedUsers as user}
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
