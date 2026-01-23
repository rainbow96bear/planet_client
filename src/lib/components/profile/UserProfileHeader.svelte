<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import ProfileImg from '../../common/profileImg/profileImg.svelte';
  import LoadingSpinner from '../../common/loadingSpinner/LoadingSpinner.svelte';

  import styles from './UserProfileHeader.module.css';

  import type {
    UserProfileHeaderProfile,
    ActionType
  } from './UserProfileHeader.types';

  import { getActionButtons } from './UserProfileHeader.logic';

  export let isLoading = false;
  export let profile: UserProfileHeaderProfile | null = null;
  export let isMyProfile = false;
  export let isFollowing: boolean | null = null;
  export let isLoggedIn = false;

  const dispatch = createEventDispatcher<{
    action: ActionType;
  }>();

  $: actions = getActionButtons({
    isMyProfile,
    isLoggedIn,
    isFollowing
  });
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
        src={profile.profileImage}
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
      {#each actions as action}
        <button
          class={`${styles.button} ${styles[action.variant]}`}
          on:click={() => dispatch('action', action.type)}
        >
          {action.label}
        </button>
      {/each}
    </div>
  </header>

{:else}
  <div class={styles.state}>
    프로필을 불러올 수 없습니다.
  </div>
{/if}
