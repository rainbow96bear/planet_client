<!-- routes/(app)/profile/[nickname]/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { profileStore } from '$lib/stores/profile/profile.store';
  import { feedStore } from '$lib/stores/feed/feed.store';  // ← Feed Store 추가
  import { profileService } from '$lib/services/profile/profile.service';
  // import ProfileHeader from '$lib/components/profile/ProfileHeader.svelte';
  // import Calendar from '$lib/components/profile/Calendar.svelte';
  // import FeedSection from '$lib/components/profile/FeedSection.svelte';
  import type { PageData } from './$types';
  import type { FeedFilter } from '$lib/stores/feed/feed.types';  // ← Feed types에서 import
  import styles from './page.module.css';

  export let data: PageData;

  $: ({ nickname, isMyProfile } = data);

  // Store 구독
  $: profile = $profileStore.profile;
  $: calendarEvents = $profileStore.calendarEvents;
  $: isFollowing = $profileStore.isFollowing;
  $: selectedFilter = $feedStore.selectedFilter;  // ← Feed Store에서 가져옴
  $: loading = $profileStore.loading;

  // 팔로우/언팔로우 핸들러
  async function handleFollow() {
    if (!nickname) return;
    await profileService.follow(nickname);
  }

  async function handleUnfollow() {
    if (!nickname) return;
    await profileService.unfollow(nickname);
  }

  // 캘린더 월 변경 핸들러
  async function handleMonthChange(event: CustomEvent<{ year: number; month: number }>) {
    const { year, month } = event.detail;
    await profileService.loadCalendar(nickname, year, month);
  }

  // 피드 필터 변경 핸들러
  function handleFilterChange(event: CustomEvent<FeedFilter>) {
    feedStore.setFilter(event.detail);  // ← Feed Store 사용
  }

  // 컴포넌트 언마운트 시 store 초기화
  onMount(() => {
    return () => {
      profileStore.reset();
      // feedStore.reset();  // 필요시 Feed Store도 초기화
    };
  });
</script>

<div class={styles.profilePage}>
  {#if loading}
    <div class={styles.loadingContainer}>
      <div class={styles.spinner} />
      <p>프로필을 불러오는 중...</p>
    </div>
  {:else if profile}
    <div class={styles.profileContent}>
      <!-- <ProfileHeader
        {profile}
        {isFollowing}
        {isMyProfile}
        on:follow={handleFollow}
        on:unfollow={handleUnfollow}
      />

      <section class={styles.calendarSection}>
        <Calendar
          events={calendarEvents}
          on:monthChange={handleMonthChange}
        />
      </section>

      <section class={styles.feedSection}>
        <FeedSection
          filter={selectedFilter}
          on:filterChange={handleFilterChange}
        />
      </section> -->
    </div>
  {:else}
    <div class={styles.errorContainer}>
      <h2>프로필을 찾을 수 없습니다</h2>
      <p>존재하지 않는 사용자이거나 일시적인 오류가 발생했습니다.</p>
      <a href="/" class={styles.backHome}>홈으로 돌아가기</a>
    </div>
  {/if}
</div>