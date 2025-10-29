<script lang="ts">
  import { theme } from '$lib/stores/theme';
  import { auth } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  
  let currentTheme: 'light' | 'dark' = 'light';
  
  // 현재 테마 구독
  theme.subscribe(value => {
    currentTheme = value;
  });
  
  function handleThemeChange(newTheme: 'light' | 'dark') {
    theme.setTheme(newTheme);
    const tokenState = get(auth);
    try {
      const res = await fetch(`/api/user/theme`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':  `Bearer ${tokenState.access_token}`
        },
        body: JSON.stringify({ theme: newTheme })
      });

      if (!res.ok) {
        throw new Error(`테마 저장 실패: ${res.status}`);
      }
    } catch (err) {
      console.error(err);
    }
  }
  
  async function handleLogout() {
    // 로그아웃 API 호출
    try {
      await fetch('/api/user/logout', { method: 'POST' });
      goto('/');
    } catch (err) {
      console.error('로그아웃 실패:', err);
    }
  }

  onMount(() => {
    if (!get(accessToken)) {
      showNotice = true;
      setTimeout(() => {
        showNotice = false;
        goto('/login');
      }, 1000); // 1초 후 이동
    }
  });
</script>

<div class="container">
  {#if showNotice}
    <div class="overlay">
      <div class="login-notice">
        로그인이 필요합니다.
      </div>
    </div>
  {:else}
    <!-- 헤더 -->
    <div class="header">
      <button class="back-btn" on:click={() => goto('/profile')}>
        ← 뒤로
      </button>
      <h1 class="title">설정</h1>
      <div></div>
    </div>

    <!-- 설정 카드 -->
    <div class="content">
      <!-- 프로필 섹션 -->
      <div class="section">
        <h2 class="section-title">프로필</h2>
        <div class="card">
          <div class="profile-preview">
            <div class="avatar">🪐</div>
            <div class="user-info">
              <div class="username">김지현</div>
              <div class="handle">@jihyun_daily</div>
            </div>
          </div>
          <button class="edit-btn">프로필 수정</button>
        </div>
      </div>

      <!-- 테마 섹션 -->
      <div class="section">
        <h2 class="section-title">테마 설정</h2>
        <ThemeSelector {currentTheme} on:change={handleThemeChange} />
      </div>

      <!-- 계정 섹션 -->
      <div class="section">
        <h2 class="section-title">계정</h2>
        <div class="card">
          <button class="menu-item">
            <span>알림 설정</span>
            <span class="arrow">→</span>
          </button>
          <div class="divider"></div>
          <button class="menu-item">
            <span>차단 목록</span>
            <span class="arrow">→</span>
          </button>
          <div class="divider"></div>
          <button class="menu-item">
            <span>개인정보 설정</span>
            <span class="arrow">→</span>
          </button>
        </div>
      </div>

      <!-- 정보 섹션 -->
      <div class="section">
        <h2 class="section-title">정보</h2>
        <div class="card">
          <button class="menu-item">
            <span>서비스 약관</span>
            <span class="arrow">→</span>
          </button>
          <div class="divider"></div>
          <button class="menu-item">
            <span>개인정보 처리방침</span>
            <span class="arrow">→</span>
          </button>
          <div class="divider"></div>
          <button class="menu-item">
            <span>버전 정보</span>
            <span class="version">v1.0.0</span>
          </button>
        </div>
      </div>

      <!-- 로그아웃 버튼 -->
      <button class="logout-btn" on:click={handleLogout}>
        로그아웃
      </button>
    </div>
  {/if}
</div>

<style>
  .container {
    width: 100%;
    margin: 0 auto;
    min-height: 100vh;
    background: linear-gradient(to bottom, var(--bg-gradient-start), var(--bg-gradient-end));
  }

  /* 헤더 */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-light);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .back-btn {
    padding: 0.5rem;
    border: none;
    background: none;
    font-size: 1rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .back-btn:hover {
    opacity: 0.7;
  }

  .title {
    font-size: 1.125rem;
    font-weight: bold;
    color: var(--text-primary);
    margin: 0;
  }

  /* 콘텐츠 */
  .content {
    padding: 1rem;
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
  }

  /* 프로필 프리뷰 */
  .profile-preview {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .avatar {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
  }

  .user-info {
    flex: 1;
  }

  .username {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
  }

  .handle {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  .edit-btn {
    width: 100%;
    padding: 0.75rem;
    border-radius: 0.75rem;
    border: 1px solid var(--border-color);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .edit-btn:hover {
    border-color: var(--color-primary);
    background: var(--bg-primary);
  }

  /* 메뉴 아이템 */
  .menu-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border: none;
    background: none;
    font-size: 0.875rem;
    color: var(--text-primary);
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .menu-item:hover {
    opacity: 0.7;
  }

  .arrow {
    color: var(--text-tertiary);
    font-size: 1rem;
  }

  .version {
    color: var(--text-tertiary);
    font-size: 0.75rem;
  }

  .divider {
    height: 1px;
    background: var(--border-light);
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
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 1rem;
  }

  .logout-btn:hover {
    background: #FEF2F2;
  }

  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .login-notice {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
</style>