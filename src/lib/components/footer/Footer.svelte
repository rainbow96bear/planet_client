<script lang="ts" context="module">
  import { goto } from '$app/navigation';
</script>

<div class="footer">
  <div class="footer-container">
    <!-- 상단 섹션 -->
    <div class="footer-top">
      <!-- 로고 & 소개 -->
      <div class="footer-column">
        <div class="footer-logo">
          <div class="footer-logo-icon">🪐</div>
          <span class="footer-logo-text">Planet</span>
        </div>
        <p class="footer-description">
          당신의 계획이 모여 하나의 행성이 됩니다.<br/>
          매일의 할 일을 기록하고 친구들과 공유하세요.
        </p>
        <div class="footer-social">
          <a href="https://twitter.com" target="_blank" rel="noopener" class="social-link" title="Twitter">
            🐦
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener" class="social-link" title="Instagram">
            📷
          </a>
          <a href="https://github.com" target="_blank" rel="noopener" class="social-link" title="GitHub">
            💻
          </a>
          <a href="mailto:hello@planet.com" class="social-link" title="Email">
            ✉️
          </a>
        </div>
      </div>

      <!-- 서비스 -->
      <div class="footer-column">
        <h3 class="footer-title">서비스</h3>
        <nav class="footer-links">
          <a href="/about" class="footer-link">Planet 소개</a>
          <a href="/features" class="footer-link">주요 기능</a>
          <a href="/pricing" class="footer-link">요금제</a>
          <a href="/blog" class="footer-link">블로그</a>
        </nav>
      </div>

      <!-- 지원 -->
      <div class="footer-column">
        <h3 class="footer-title">지원</h3>
        <nav class="footer-links">
          <a href="/help" class="footer-link">고객센터</a>
          <a href="/faq" class="footer-link">자주 묻는 질문</a>
          <a href="/contact" class="footer-link">문의하기</a>
          <a href="/feedback" class="footer-link">피드백</a>
        </nav>
      </div>

      <!-- 법적 고지 -->
      <div class="footer-column">
        <h3 class="footer-title">법적 고지</h3>
        <nav class="footer-links">
          <a href="/terms" class="footer-link">이용약관</a>
          <a href="/privacy" class="footer-link">개인정보처리방침</a>
          <a href="/community-guidelines" class="footer-link">커뮤니티 가이드</a>
          <a href="/licenses" class="footer-link">오픈소스 라이선스</a>
        </nav>
      </div>
    </div>

    <!-- 구분선 -->
    <div class="footer-divider"></div>

    <!-- 하단 섹션 -->
    <div class="footer-bottom">
      <div class="footer-copyright">
        © 2025 Planet. All rights reserved.
      </div>
      <div class="footer-language">
        <button class="language-btn">
          🌐 한국어
          <span class="dropdown-arrow">▼</span>
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .footer {
    background: var(--bg-primary);
    border-top: 1px solid var(--border-light);
    margin-top: auto;
  }

  .footer-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 3rem 1.5rem 2rem;
  }

  /* 상단 섹션 */
  .footer-top {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 3rem;
    margin-bottom: 2rem;
  }

  /* 로고 & 소개 */
  .footer-logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .footer-logo-icon {
    font-size: 2rem;
  }

  .footer-logo-text {
    font-size: 1.5rem;
    font-weight: bold;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .footer-description {
    color: var(--text-secondary);
    font-size: 0.9375rem;
    line-height: 1.6;
    margin: 0 0 1.5rem 0;
  }

  .footer-social {
    display: flex;
    gap: 0.75rem;
  }

  .social-link {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: var(--bg-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    text-decoration: none;
    transition: all 0.2s;
  }

  .social-link:hover {
    background: var(--border-light);
    transform: scale(1.1);
  }

  /* 칼럼 */
  .footer-column {
    display: flex;
    flex-direction: column;
  }

  .footer-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 1rem 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .footer-links {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .footer-link {
    color: var(--text-secondary);
    font-size: 0.9375rem;
    text-decoration: none;
    transition: color 0.2s;
  }

  .footer-link:hover {
    color: var(--color-primary);
  }

  /* 구분선 */
  .footer-divider {
    height: 1px;
    background: var(--border-light);
    margin: 2rem 0;
  }

  /* 하단 섹션 */
  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .footer-copyright {
    color: var(--text-tertiary);
    font-size: 0.875rem;
  }

  .language-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-light);
    border-radius: 0.5rem;
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .language-btn:hover {
    background: var(--border-light);
  }

  .dropdown-arrow {
    font-size: 0.625rem;
    color: var(--text-tertiary);
  }

  /* 반응형 - 태블릿 */
  @media (max-width: 1024px) {
    .footer-top {
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
  }

  /* 반응형 - 모바일 */
  @media (max-width: 768px) {
    .footer-container {
      padding: 2rem 1rem 1.5rem;
    }

    .footer-top {
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .footer-bottom {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }

    .footer-description {
      font-size: 0.875rem;
    }
  }
</style>