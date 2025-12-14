<script lang="ts">
  import { goto } from '$app/navigation';
  import ProfileImg from '../common/profileImg/profileImg.svelte';
  import LoadingSpinner from '../common/loadingSpinner/LoadingSpinner.svelte';

  import styles from './UserProfileHeader.module.css';

  export let isLoading = false;

  export let profile: {
    id: string;
    nickname: string;
    bio?: string;
    profileImage?: string;
    followerCount?: number;
    followingCount?: number;
  } | null = null;

  export let isMyProfile = false;
  export let isFollowing: boolean | null = null;
  export let isLoggedIn = false;
</script>

{#if isLoading}
  <div class={styles.state}>
    <LoadingSpinner message="로딩 중..." />
  </div>

{:else if profile}
  <header class={styles.header}>
    <!-- 프로필 정보 -->
    <div class={styles.profileInfo}>
      <ProfileImg
        src={profile.profileImage ?? undefined}
        alt={profile.nickname}
        size={80}
      />

      <div class={styles.text}>
        <h1>{profile.nickname}</h1>
        {#if profile.bio}
          <p>{profile.bio}</p>
        {/if}

        <div class={styles.counts}>
          <span>
            <strong>{profile.followerCount ?? 0}</strong> 팔로워
          </span>
          <span>
            <strong>{profile.followingCount ?? 0}</strong> 팔로잉
          </span>
        </div>
      </div>
    </div>

    <!-- 액션 버튼 -->
    <div class={styles.actions}>
      {#if isMyProfile}
        <button
          class={`${styles.button} ${styles.primary}`}
          on:click={() => goto(`/calendar/new`)}
        >
          일정 추가
        </button>

        <button
          class={`${styles.button} ${styles.primary}`}
          on:click={() => goto(`/feed/new`)}
        >
          피드 작성
        </button>

        <button
          class={`${styles.button} ${styles.secondary}`}
          on:click={() => goto('/settings')}
        >
          설정
        </button>

      {:else if isLoggedIn}
        <button
          class={`${styles.button} ${
            isFollowing ? styles.outline : styles.primary
          }`}
        >
          {isFollowing ? '언팔로우' : '팔로우'}
        </button>

      {:else}
        <button
          class={`${styles.button} ${styles.primary}`}
          on:click={() => goto('/login')}
        >
          팔로우
        </button>
      {/if}
    </div>
  </header>

{:else}
  <div class={styles.state}>
    프로필을 불러올 수 없습니다.
  </div>
{/if}
