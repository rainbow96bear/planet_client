<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  
  export let isLoggedIn: boolean = false;
  export let notificationCount: number = 0;
  export let userAvatar: string = '🪐';
  
  let isMenuOpen = false;
  let isSearchFocused = false;
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  function handleSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.value.trim()) {
      goto(`/search?q=${encodeURIComponent(target.value)}`);
      target.value = '';
      isSearchFocused = false;
    }
  }
  console.log(isLoggedIn)
</script>

<div class="header">
  <div class="header-container">
    <!-- 로고 -->
    <button class="logo" on:click={() => goto('/')}>
      <div class="logo-icon">🪐</div>
      <span class="logo-text">Planet</span>
    </button>

    <!-- 검색바 (데스크톱) -->
    {#if isLoggedIn}
      <div class="search-container desktop-only">
        <span class="search-icon">🔍</span>
        <input
          type="text"
          placeholder="계획, 친구, 태그 검색..."
          class="search-input"
          on:focus={() => isSearchFocused = true}
          on:blur={() => setTimeout(() => isSearchFocused = false, 200)}
          on:keypress={(e) => e.key === 'Enter' && handleSearch(e)}
        />
        {#if isSearchFocused}
          <div class="search-dropdown">
            <div class="search-recent">
              <div class="search-section-title">최근 검색</div>
              <button class="search-item">
                <span>🔍</span>
                <span>운동루틴</span>
              </button>
              <button class="search-item">
                <span>🔍</span>
                <span>독서챌린지</span>
              </button>
            </div>
          </div>
        {/if}
      </div>
    {/if}

    <!-- 우측 메뉴 -->
    <div class="header-actions">
      {#if isLoggedIn}
        <!-- 로그인 상태 -->
        <button class="icon-btn desktop-only" on:click={() => goto('/explore')} title="탐색">
          🌍
        </button>
        <button class="icon-btn" on:click={() => goto('/notifications')} title="알림">
          🔔
          {#if notificationCount > 0}
            <span class="notification-badge">{notificationCount > 99 ? '99+' : notificationCount}</span>
          {/if}
        </button>
        <button class="icon-btn desktop-only" on:click={() => goto('/messages')} title="메시지">
          💬
        </button>
        <button class="avatar-btn" on:click={() => goto('/profile')} title="프로필">
          {userAvatar}
        </button>
        
        <!-- 모바일 메뉴 버튼 -->
        <button class="menu-btn mobile-only" on:click={toggleMenu}>
          {isMenuOpen ? '✕' : '☰'}
        </button>
      {:else}
        <!-- 비로그인 상태 -->
        <button class="signup-btn" on:click={() => goto('/login')}>
          시작하기
        </button>
      {/if}
    </div>
  </div>

  <!-- 모바일 메뉴 -->
  {#if isMenuOpen && isLoggedIn}
    <div class="mobile-menu">
      <button class="mobile-menu-item" on:click={() => { goto('/'); isMenuOpen = false; }}>
        <span>🏠</span>
        <span>홈</span>
      </button>
      <button class="mobile-menu-item" on:click={() => { goto('/explore'); isMenuOpen = false; }}>
        <span>🌍</span>
        <span>탐색</span>
      </button>
      <button class="mobile-menu-item" on:click={() => { goto('/bookmarks'); isMenuOpen = false; }}>
        <span>🔖</span>
        <span>북마크</span>
      </button>
      <button class="mobile-menu-item" on:click={() => { goto('/settings'); isMenuOpen = false; }}>
        <span>⚙️</span>
        <span>설정</span>
      </button>
    </div>
  {/if}
</div>

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-light);
    backdrop-filter: blur(10px);
  }

  .header-container {
    max-width: 1280px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.5rem;
    gap: 1rem;
  }

  /* 로고 */
  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.75rem;
    transition: all 0.2s;
  }

  .logo:hover {
    background: var(--bg-secondary);
  }

  .logo-icon {
    font-size: 1.75rem;
  }

  .logo-text {
    font-size: 1.5rem;
    font-weight: bold;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* 검색 */
  .search-container {
    position: relative;
    flex: 1;
    max-width: 600px;
  }

  .search-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1rem;
    pointer-events: none;
  }

  .search-input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: 1px solid var(--border-light);
    border-radius: 1.5rem;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 0.9375rem;
    outline: none;
    transition: all 0.2s;
  }

  .search-input:focus {
    background: var(--bg-primary);
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(125, 189, 182, 0.1);
  }

  .search-dropdown {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    right: 0;
    background: var(--bg-primary);
    border: 1px solid var(--border-light);
    border-radius: 1rem;
    box-shadow: var(--shadow-lg);
    padding: 0.5rem;
    max-height: 400px;
    overflow-y: auto;
  }

  .search-section-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-secondary);
    padding: 0.5rem 0.75rem;
  }

  .search-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem;
    border: none;
    background: none;
    border-radius: 0.5rem;
    color: var(--text-primary);
    font-size: 0.9375rem;
    cursor: pointer;
    transition: background 0.2s;
    text-align: left;
  }

  .search-item:hover {
    background: var(--bg-secondary);
  }

  /* 헤더 액션 */
  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .icon-btn {
    position: relative;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: none;
    background: var(--bg-secondary);
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icon-btn:hover {
    background: var(--border-light);
    transform: scale(1.05);
  }

  .notification-badge {
    position: absolute;
    top: -0.25rem;
    right: -0.25rem;
    background: #EF4444;
    color: white;
    font-size: 0.625rem;
    font-weight: bold;
    padding: 0.125rem 0.375rem;
    border-radius: 0.75rem;
    min-width: 1rem;
    text-align: center;
  }

  .avatar-btn {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: 2px solid var(--color-primary);
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .avatar-btn:hover {
    transform: scale(1.05);
  }

  .login-btn {
    padding: 0.625rem 1.25rem;
    border-radius: 1.25rem;
    border: 1px solid var(--border-light);
    background: var(--bg-primary);
    color: var(--text-primary);
    font-weight: 600;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .login-btn:hover {
    background: var(--bg-secondary);
  }

  .signup-btn {
    padding: 0.625rem 1.25rem;
    border-radius: 1.25rem;
    border: none;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    color: white;
    font-weight: 600;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(125, 189, 182, 0.3);
  }

  .signup-btn:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(125, 189, 182, 0.4);
  }

  /* 모바일 메뉴 */
  .menu-btn {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 0.5rem;
    border: none;
    background: var(--bg-secondary);
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .menu-btn:hover {
    background: var(--border-light);
  }

  .mobile-menu {
    border-top: 1px solid var(--border-light);
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .mobile-menu-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.875rem 1rem;
    border: none;
    background: none;
    border-radius: 0.75rem;
    color: var(--text-primary);
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
    text-align: left;
  }

  .mobile-menu-item:hover {
    background: var(--bg-secondary);
  }

  /* 반응형 */
  .desktop-only {
    display: flex;
  }

  .mobile-only {
    display: none;
  }

  @media (max-width: 768px) {
    .desktop-only {
      display: none;
    }

    .mobile-only {
      display: flex;
    }

    .logo-text {
      font-size: 1.25rem;
    }

    .header-container {
      padding: 0.75rem 1rem;
    }
  }
</style>