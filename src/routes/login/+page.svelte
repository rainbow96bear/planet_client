<script lang="ts">
  import type { Provider } from "LoginProvider";
  import KakaoLoginBtn from "$lib/components/login/KakaoLoginBtn.svelte"; 
	import { goto } from "$app/navigation";
  // CSS 모듈 임포트
  import styles from './Login.module.css';

  const KakaoOauthProviders : Provider = {
    name: 'Kakao',
    icon: '/oauthBtn/kakaotalk_sharing_btn_medium.png',
    url: '/api/oauth/kakao/login'
  };

  /**
   * OAuth 로그인 처리: 현재 경로를 저장하고 제공된 URL로 이동합니다.
   * @param provider - 로그인 제공자 정보
   */
  function handleLogin(provider: Provider) {
    const currentPath = window.location.pathname; 
    localStorage.setItem('redirectAfterLogin', currentPath);
    window.location.href = provider.url;
  }
</script>

<div class={styles.container}>
  <div class={styles.bgPlanet + ' ' + styles.planet1}></div>
  <div class={styles.bgPlanet + ' ' + styles.planet2}></div>
  <div class={styles.bgPlanet + ' ' + styles.planet3}></div>
  
  <div class={styles.contentWrapper}>
    <div class={styles.logoSection}>
      <div class={styles.logoCircle}>
        <span class={styles.logoEmoji}>🪐</span>
      </div>
      <button type="button" on:click={() => goto("/")} class={styles.logoButton}>
        <h1 class={styles.logoText}>Planet</h1> 
      </button>
      <p class={styles.tagline}>당신의 계획이 모여 하나의 행성이 됩니다</p>
    </div>

    <div class={styles.loginCard}>
      <h2 class={styles.cardTitle}>로그인</h2>
      
      <div class={styles.welcomeText}>
        <p>오늘의 할 일을 기록하고,</p>
        <p>목표를 달성하며 성장하는 과정을</p>
        <p>친구들과 공유하세요 🚀</p>
      </div>

      <div class={styles.btnList}>
        <KakaoLoginBtn 
          provider={KakaoOauthProviders} 
          on:click={() => handleLogin(KakaoOauthProviders)} 
        />
      </div>

      <p class={styles.bottomText}>
        Planet에 로그인하여<br/>
        나만의 작은 우주를 만들어보세요 🌌
      </p>
    </div>

    <div class={styles.footerText}>
      <p>Planet에 로그인하면 서비스 약관 및 개인정보 보호정책에</p>
      <p>동의하게 됩니다.</p>
    </div>
  </div>
</div>