<script lang="ts">
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { goto } from '$app/navigation';
  import { theme } from '$lib/stores/theme';
  import { auth, clearAuth } from '$lib/stores/auth';
  import { userProfile } from '$lib/stores/userProfile';
  import ThemeSelector from '$lib/components/common/themeSelector/ThemeSelector.svelte';

  let currentTheme: 'light' | 'dark' = 'light';
  let isLoggedIn = false;
  let profile = $userProfile; // ✅ store 데이터 자동 구독
  // 테마 변경 처리
  async function handleThemeChange(event: CustomEvent<{ theme: 'light' | 'dark' }>) {
    const newTheme = event.detail.theme;
    theme.setTheme(newTheme);

    const tokenState = get(auth);
    if (!tokenState?.access_token) return;

    try {
      await fetch('/api/user/theme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenState.access_token}`,
        },
        body: JSON.stringify({ theme: newTheme }),
      });
    } catch (err) {
      console.error(err);
    }
  }

  // 로그아웃 처리
  async function handleLogout() {
    try {
      const tokenState = get(auth);

      await fetch('/api/user/logout', {
        method: 'POST',
        headers: tokenState
          ? { Authorization: `Bearer ${tokenState.access_token}` }
          : {},
        credentials: 'include',
      });

      clearAuth();
      userProfile.set(null); // ✅ 로그아웃 시 프로필 초기화
      goto('/');
    } catch (err) {
      console.error('로그아웃 실패:', err);
    }
  }

  // 로그인 여부 및 프로필 로드
  onMount(() => {
    const tokenState = get(auth);
    if (!tokenState?.access_token) {
      isLoggedIn = false;
      goto('/login');
      return;
    }

    // 로그인 상태면 isLoggedIn true
    isLoggedIn = true;

    // store 구독
    const unsubscribe = userProfile.subscribe((value) => {
      profile = value;
      console.log('profile 업데이트:', value);
    });

    return () => unsubscribe();
  });
</script>

<div class="settings-container">
  {#if !isLoggedIn || !profile}
    <div class="overlay">
      <div class="notice">로그인이 필요합니다.</div>
    </div>
  {:else}
    <!-- Header -->
    <header class="settings-header">
      <button class="back-btn" on:click={() => history.back()}>← 뒤로</button>
      <h1 class="header-title">설정</h1>
      <div class="header-placeholder"></div>
    </header>

    <!-- Content -->
    <main class="settings-content">
      <!-- 프로필 -->
      <section class="section">
        <h2 class="section-title">프로필</h2>
        <div class="card profile-card">
          <div class="profile-info">
            <div class="avatar">
              {#if profile.profile_image}
                <img src={profile.profile_image} alt="프로필" style="width:100%; height:100%; border-radius:50%;" />
              {:else}
                🪐
              {/if}
            </div>
            <div class="user-details">
              <div class="username">{profile.nickname}</div>
            </div>
          </div>
          <!--
          <button class="edit-btn" on:click={() => goto('/profile/edit')}>프로필 수정</button>
          -->
        </div>
      </section>

      <!-- 테마 설정 -->
      <section class="section">
        <h2 class="section-title">테마</h2>
        <ThemeSelector currentTheme={$theme} on:change={handleThemeChange} />
      </section>

      <!-- 계정 -->
      <!--
      <section class="section">
        <h2 class="section-title">계정</h2>
        <div class="card">
          <button class="menu-item">
            <span>알림 설정</span><span class="arrow">→</span>
          </button>
          <div class="divider"></div>
          <button class="menu-item">
            <span>차단 목록</span><span class="arrow">→</span>
          </button>
          <div class="divider"></div>
          <button class="menu-item">
            <span>개인정보 설정</span><span class="arrow">→</span>
          </button>
        </div>
      </section>
      -->
      <!-- 정보 -->
      <!--
      <section class="section">
        <h2 class="section-title">정보</h2>
        <div class="card">
          <button class="menu-item">
            <span>서비스 약관</span><span class="arrow">→</span>
          </button>
          <div class="divider"></div>
          <button class="menu-item">
            <span>개인정보 처리방침</span><span class="arrow">→</span>
          </button>
          <div class="divider"></div>
          <button class="menu-item">
            <span>버전 정보</span><span class="version">v1.0.0</span>
          </button>
        </div>
      </section>
      -->

      <!-- 로그아웃 -->
      <button class="logout-btn" on:click={handleLogout}>로그아웃</button>
    </main>
  {/if}
</div>

<style>
  /* 전체 컨테이너 */
  .settings-container {
    min-height: 100vh;
    background: linear-gradient(to bottom, var(--bg-gradient-start), var(--bg-gradient-end));
    color: var(--text-primary);
    transition: background 0.3s ease, color 0.3s ease;
  }

  /* 오버레이 */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .notice {
    background: var(--bg-primary);
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: var(--shadow-md);
    font-weight: 600;
    text-align: center;
  }

  /* Header */
  .settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background: var(--header-bg);
    border-bottom: 1px solid var(--header-border);
    backdrop-filter: blur(var(--header-blur));
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .back-btn {
    background: none;
    border: none;
    font-size: 1rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .back-btn:hover {
    opacity: 0.7;
  }

  .header-title {
    font-size: 1.125rem;
    font-weight: bold;
  }

  .header-placeholder {
    width: 2rem;
  }

  /* Content */
  .settings-content {
    padding: 1rem 1.25rem;
  }

  .section {
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-secondary);
    margin: 0 0 0.75rem 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .card {
    background: var(--bg-primary);
    border-radius: 1rem;
    padding: 1rem;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  /* 프로필 카드 */
  .profile-card {
    justify-content: space-between;
    align-items: center;
  }

  .profile-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }

  .user-details {
    display: flex;
    flex-direction: column;
  }

  .username {
    font-weight: 600;
  }

  .handle {
    font-size: 0.75rem;
    color: var(--text-secondary);
  }

  .edit-btn {
    padding: 0.5rem 1rem;
    border-radius: 0.75rem;
    border: 1px solid var(--color-primary);
    background: var(--bg-primary);
    color: var(--color-primary);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .edit-btn:hover {
    background: var(--bg-secondary);
  }

  /* 메뉴 아이템 */
  .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    border: none;
    background: none;
    font-size: 0.9375rem;
    cursor: pointer;
    border-radius: 0.75rem;
    transition: background 0.2s;
  }

  .menu-item:hover {
    background: var(--bg-secondary);
  }

  .divider {
    height: 1px;
    background: var(--border-light);
    margin: 0.25rem 0;
  }

  .arrow {
    color: var(--text-tertiary);
  }

  .version {
    color: var(--text-tertiary);
    font-size: 0.875rem;
  }

  /* 로그아웃 버튼 */
  .logout-btn {
    width: 100%;
    padding: 0.875rem;
    border-radius: 0.75rem;
    border: 1px solid #EF4444;
    background: var(--bg-primary);
    color: #EF4444;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 1rem;
  }

  .logout-btn:hover {
    background: #FEF2F2;
  }
</style>
