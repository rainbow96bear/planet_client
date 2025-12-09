<script lang="ts">
  import { goto } from '$app/navigation';
  import ProfileImg from '../common/profileImg/profileImg.svelte';
  import LoadingSpinner from '../common/loadingSpinner/LoadingSpinner.svelte';
  import { user,isLoggedIn } from '$lib/stores';

  export let isLoading: boolean = false;
  export let isMyProfile: boolean = false;
  export let isFollowing: boolean | null = null;

</script>

{#if isLoading}
  <LoadingSpinner message="로딩 중..." />
{:else if $user.id}
  <div class="profile-header">
    <div class="profile-info">
      <ProfileImg src={$user.profileImage ?? undefined} alt={$user.nickname ?? ''} size={80} />
      <h1>{$user.nickname}</h1>
      <p>{$user.bio ?? ''}</p>

      <div class="actions">
        {#if isMyProfile}
          <button on:click={() => goto('/settings')}>설정</button>
        {:else if $isLoggedIn}
          <button on:click={() => console.log('팔로우/언팔로우')}>
            {isFollowing ? '언팔로우' : '팔로우'}
          </button>
        {:else}
          <button on:click={() => goto('/login')}>팔로우</button>
        {/if}
      </div>
    </div>
  </div>
{:else}
  <div>프로필을 불러올 수 없습니다.</div>
{/if}


<style>
  .profile-header {
    padding: 1.5rem;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    box-shadow: var(--shadow-lg);
    position: relative;
    overflow: hidden;
  }
/*  */
</style>