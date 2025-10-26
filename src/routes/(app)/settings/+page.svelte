<script lang="ts">
  import { theme } from '$lib/stores/theme';
  import { goto } from '$app/navigation';
  
  let currentTheme: 'light' | 'dark' = 'light';
  
  // 현재 테마 구독
  theme.subscribe(value => {
    currentTheme = value;
  });
  
  function handleThemeChange(newTheme: 'light' | 'dark') {
    theme.setTheme(newTheme);
  }
  
  async function handleLogout() {
    // 로그아웃 API 호출
    try {
      await fetch('/api/logout', { method: 'POST' });
      goto('/');
    } catch (err) {
      console.error('로그아웃 실패:', err);
    }
  }
</script>

<div class="container">
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
      <div class="card">
        <div class="theme-options">
          <button 
            class="theme-option"
            class:active={currentTheme === 'light'}
            on:click={() => handleThemeChange('light')}
          >
            <div class="theme-preview light-preview">
              <div class="preview-header"></div>
              <div class="preview-content">
                <div class="preview-line"></div>
                <div class="preview-line short"></div>
              </div>
            </div>
            <span class="theme-name">라이트 모드</span>
            {#if currentTheme === 'light'}
              <span class="check-icon">✓</span>
            {/if}
          </button>

          <button 
            class="theme-option"
            class:active={currentTheme === 'dark'}
            on:click={() => handleThemeChange('dark')}
          >
            <div class="theme-preview dark-preview">
              <div class="preview-header"></div>
              <div class="preview-content">
                <div class="preview-line"></div>
                <div class="preview-line short"></div>
              </div>
            </div>
            <span class="theme-name">다크 모드</span>
            {#if currentTheme === 'dark'}
              <span class="check-icon">✓</span>
            {/if}
          </button>
        </div>
      </div>
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

  /* 테마 옵션 */
  .theme-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .theme-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: 0.75rem;
    border: 2px solid var(--border-light);
    background: var(--bg-secondary);
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
  }

  .theme-option:hover {
    border-color: var(--color-primary);
  }

  .theme-option.active {
    border-color: var(--color-primary);
    background: var(--bg-primary);
  }

  .theme-preview {
    width: 100%;
    aspect-ratio: 4 / 3;
    border-radius: 0.5rem;
    overflow: hidden;
    box-shadow: var(--shadow-sm);
  }

  .light-preview {
    background: #FFFFFF;
  }

  .dark-preview {
    background: #1F2937;
  }

  .preview-header {
    height: 30%;
    background: linear-gradient(135deg, #7DBDB6, #8B9DC3);
  }

  .preview-content {
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .light-preview .preview-line {
    height: 0.5rem;
    background: #E5E7EB;
    border-radius: 0.25rem;
  }

  .dark-preview .preview-line {
    height: 0.5rem;
    background: #374151;
    border-radius: 0.25rem;
  }

  .preview-line.short {
    width: 60%;
  }

  .theme-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .check-icon {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    background: var(--color-primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: bold;
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
</style>