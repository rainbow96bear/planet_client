<script lang="ts">
  import { goto } from "$app/navigation";
  import styles from './page.module.css';
	import { KakaoOauthProvider, loginWithKakao } from "./page";
	import KakaoLoginBtn from "$lib/components/login/KakaoLoginBtn.svelte";
</script>

<div class={styles.container}>
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
          provider={KakaoOauthProvider}
          on:click={() => loginWithKakao()}
        />
      </div>

      <p class={styles.bottomText}>
        Planet에 로그인하여<br />
        나만의 작은 우주를 만들어보세요 🌌
      </p>
    </div>

    <div class={styles.footerText}>
      <p>Planet에 로그인하면 서비스 약관 및 개인정보 보호정책에</p>
      <p>동의하게 됩니다.</p>
    </div>
  </div>
</div>
