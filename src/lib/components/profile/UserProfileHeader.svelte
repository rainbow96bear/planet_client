<script lang="ts">
	import { goto } from '$app/navigation';
  import type { UserProfile } from '$lib/types/profile';

  export let profile: UserProfile | null;
  export let isLoading: boolean = false;

  // 상위에서 결정해서 전달
  export let isMyProfile: boolean = false; // 내 프로필이면 true
  export let isFollowing: boolean | null = null; // 팔로우 상태, 로그인 안하면 null
</script>

{#if isLoading}
  <div class="profile-header loading">
    <div class="loading-spinner">로딩 중...</div>
  </div>
{:else if profile}
  <div class="profile-header">
    <div class="bg-decoration decoration-1"></div>
    <div class="bg-decoration decoration-2"></div>

    <div class="header-content">
      <div class="profile-info">
        <div class="avatar">
          <span class="avatar-emoji">{profile.profile_image || '🪐'}</span>
        </div>
        <div class="user-info">
          <h1 class="username">{profile.nickname}</h1>
          <p class="handle">{profile.bio}</p>
        </div>
        <!-- 버튼 영역 -->
        <div class="actions">
          {#if isMyProfile}
            <!-- 캘린더 일정 추가 버튼 -->
            <button class="btn btn-primary" on:click={() => goto(`/profile/${profile?.nickname}/calendar/new`)}>
              일정 추가
            </button>
            <!-- 피드 작성 버튼 -->
            <button class="btn btn-primary" on:click={() => goto(`/profile/${profile?.nickname}/feed/new`)}>
              피드 작성
            </button>
            <!-- 설정 버튼 -->
            <button class="btn btn-secondary" on:click={() => goto('/settings')}>설정</button>
          {:else if isFollowing === true}
            <button class="btn btn-danger">언팔로우</button>
          {:else if isFollowing === false}
            <button class="btn btn-primary">팔로우</button>
          {:else}
            <button class="btn btn-primary">팔로우</button>
          {/if}
        </div>
      </div>

      <div class="stats">
        <div class="stat-item">
          <div class="stat-value">{profile.followerCount || 0}</div>
          <div class="stat-label">팔로워</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{profile.followingCount || 0}</div>
          <div class="stat-label">팔로잉</div>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="error-message">프로필을 불러올 수 없습니다.</div>
{/if}

<style>
  .profile-header {
    padding: 1.5rem;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    box-shadow: var(--shadow-lg);
    position: relative;
    overflow: hidden;
  }

  .profile-header.loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 12rem;
  }

  .loading-spinner {
    color: white;
    font-size: 1rem;
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
    flex-wrap: wrap;
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
    min-width: 150px;
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

  .actions {
    display: flex;
    gap: 0.5rem;
    margin-left: auto;
  }

  /* 반응형: 작은 화면에서는 버튼을 아래로 */
  @media (max-width: 480px) {
    .actions {
      margin-left: 0;
      width: 100%;
      flex-basis: 100%;
      justify-content: center;
      margin-top: 0.5rem;
    }
  }

  .btn {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 600;
    cursor: pointer;
  }

  .btn-primary {
    background-color: var(--color-primary);
    color: white;
    border: none;
  }

  .btn-secondary {
    background-color: gray;
    color: white;
    border: none;
  }

  .btn-danger {
    background-color: #ef4444;
    color: white;
    border: none;
  }

  .error-message {
    color: #EF4444;
    background: var(--bg-primary);
    padding: 2rem 1rem;
    text-align: center;
  }
</style>