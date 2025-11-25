<script lang="ts">
  import type { Provider } from "LoginProvider";
  import KakaoLoginBtn from "$lib/components/login/kakaoLoginBtn.svelte";
	import { goto } from "$app/navigation";

  const KakaoOauthProviders : Provider = {
    name: 'Kakao',
    icon: '/oauthBtn/kakaotalk_sharing_btn_medium.png',
    url: '/api/oauth/kakao/login'
  };

  function handleLogin(provider: Provider) {
    // 현재 경로 저장
    const previousUrl = document.referrer || '/';
    localStorage.setItem('redirectAfterLogin', previousUrl);
    // 로그인 URL로 이동
    window.location.href = provider.url;
  }
</script>

<div class="container">
  <div class="bg-planet planet-1"></div>
  <div class="bg-planet planet-2"></div>
  <div class="bg-planet planet-3"></div>
  
  <div class="content-wrapper">
    <div class="logo-section">
      <div class="logo-circle">
        <span class="logo-emoji">🪐</span>
      </div>
      <button type="button" on:click={() => goto("/")}>
        <h1>클릭</h1>
      </button>
      <p class="tagline">당신의 계획이 모여 하나의 행성이 됩니다</p>
    </div>

    <div class="login-card">
      <h2 class="card-title">로그인</h2>
      
      <div class="welcome-text">
        <p>오늘의 할 일을 기록하고,</p>
        <p>목표를 달성하며 성장하는 과정을</p>
        <p>친구들과 공유하세요 🚀</p>
      </div>

      <div class="btn-list">
        <KakaoLoginBtn 
          provider={KakaoOauthProviders} 
          on:click={() => handleLogin(KakaoOauthProviders)} 
        />
      </div>

      <p class="bottom-text">
        Planet에 로그인하여<br/>
        나만의 작은 우주를 만들어보세요 🌌
      </p>
    </div>

    <div class="footer-text">
      <p>Planet에 로그인하면 서비스 약관 및 개인정보 보호정책에</p>
      <p>동의하게 됩니다.</p>
    </div>
  </div>
</div>

<style>
  .container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    position: relative;
    overflow: hidden;
    background: linear-gradient(to bottom, #E8F3F1, #F0F0FF);
  }

  /* 배경 행성 장식 */
  .bg-planet {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
  }

  .planet-1 {
    top: 5rem;
    right: 2.5rem;
    width: 10rem;
    height: 10rem;
    background: rgba(125, 189, 182, 0.2);
    filter: blur(60px);
  }

  .planet-2 {
    bottom: 5rem;
    left: 2.5rem;
    width: 15rem;
    height: 15rem;
    background: rgba(139, 157, 195, 0.2);
    filter: blur(60px);
  }

  .planet-3 {
    top: 50%;
    left: 25%;
    width: 8rem;
    height: 8rem;
    background: rgba(184, 164, 201, 0.15);
    filter: blur(40px);
  }

  .content-wrapper {
    width: 100%;
    max-width: 28rem;
    position: relative;
    z-index: 10;
  }

  /* 로고 섹션 */
  .logo-section {
    text-align: center;
    margin-bottom: 2rem;
  }

  .logo-circle {
    display: inline-block;
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    background: linear-gradient(135deg, #7DBDB6, #8B9DC3);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 20px 60px rgba(125, 189, 182, 0.3);
    margin-bottom: 1rem;
  }

  .logo-emoji {
    font-size: 3rem;
  }

  .logo-text {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #7DBDB6, #8B9DC3);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .tagline {
    color: #6B7280;
    font-size: 0.875rem;
  }

  /* 로그인 카드 */
  .login-card {
    background: white;
    border-radius: 1.5rem;
    padding: 2rem;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(125, 189, 182, 0.2);
  }

  .card-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #111827;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .welcome-text {
    text-align: center;
    color: #6B7280;
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .welcome-text p {
    margin: 0;
  }

  .btn-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .bottom-text {
    text-align: center;
    color: #6B7280;
    font-size: 0.875rem;
    line-height: 1.5;
    margin: 0;
  }

  /* 하단 안내 문구 */
  .footer-text {
    margin-top: 2rem;
    text-align: center;
    font-size: 0.75rem;
    color: #9CA3AF;
    line-height: 1.5;
  }

  .footer-text p {
    margin: 0;
  }

  /* 반응형 */
  @media (max-width: 640px) {
    .logo-circle {
      width: 5rem;
      height: 5rem;
    }

    .logo-emoji {
      font-size: 2.5rem;
    }

    .logo-text {
      font-size: 2rem;
    }

    .login-card {
      padding: 1.5rem;
    }

    .card-title {
      font-size: 1.25rem;
    }

    .welcome-text {
      font-size: 0.875rem;
    }
  }
</style>