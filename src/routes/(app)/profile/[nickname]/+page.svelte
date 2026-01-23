<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { isLoggedIn } from '$lib/stores';

  import UserProfileHeader from '$lib/components/profile/UserProfileHeader.svelte';
  import Calendar from '$lib/components/common/calendar/Calendar.svelte';
  import FeedCard from '$lib/components/common/feed/FeedCard.svelte';
  import LoadingSpinner from '$lib/components/common/loadingSpinner/LoadingSpinner.svelte';
  import { ArrowLeft, ArrowRight } from 'lucide-svelte';

  import { ProfilePageState } from './profile.state';
  import styles from './page.module.css';

  $: nickname = $page.params.nickname!;
  const state = new ProfilePageState(nickname);

  onMount(() => state.init());
</script>

<div class={styles.container}>
  <UserProfileHeader
  {...props}
  on:action={(e) => {
    switch (e.detail) {
      case 'add-calendar':
        goto('/calendar/new');
        break;
      case 'add-feed':
        goto('/feed/new');
        break;
      case 'settings':
        goto('/settings');
        break;
      case 'follow':
        followUser();
        break;
      case 'unfollow':
        unfollowUser();
        break;
      case 'login':
        goto('/login');
        break;
    }
  }}
/>


  <div class={styles.tabsWrapper}>
    <button on:click={() => state.activeView = 'calendar'}>📅 캘린더</button>
    <button on:click={() => {
      state.activeView = 'feed';
      state.switchToFeed();
    }}>📰 피드</button>
  </div>

  {#if state.activeView === 'calendar'}
    <div class={styles.monthControls}>
      <button on:click={() => state.changeMonth(-1)}><ArrowLeft /></button>
      <span>{state.currentYear}년 {state.currentMonth}월</span>
      <button on:click={() => state.changeMonth(1)}><ArrowRight /></button>
    </div>

    {#if state.isLoadingCalendar}
      <LoadingSpinner message="캘린더 불러오는 중..." />
    {:else}
      <Calendar
        events={state.calendarEvents}
        nickname={nickname}
        year={state.currentYear}
        month={state.currentMonth}
      />
    {/if}
  {/if}

  {#if state.activeView === 'feed'}
    {#if state.isLoadingFeed}
      <LoadingSpinner message="피드를 불러오는 중..." />
    {:else}
      {#each state.feedData as feed (feed.id)}
        <FeedCard {feed} />
      {/each}
    {/if}
  {/if}
</div>
