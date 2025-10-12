<script lang="ts">
  import type { Provider } from "LoginProvider";
  import KakaoLoginBtn from "$lib/components/kakaoLoginBtn.svelte";

  const KakaoOauthProviders : Provider = {
    name: 'Kakao',
    icon: '/oauthBtn/kakaotalk_sharing_btn_medium.png',
    url: '/api/login/kakao'
  };

  function handleLogin(provider: Provider) {
    // 현재 경로 저장
    const previousUrl = document.referrer || '/'; // referrer가 없으면 기본 '/'로
    localStorage.setItem('redirectAfterLogin', previousUrl);
    // 로그인 URL로 이동
    window.location.href = provider.url;
  }
</script>

<div class="container">
  <div class="card">
    <h1>Planet에 오신 걸<br/>환영합니다 🌟</h1>

    <p class="intro">
      오늘의 할 일을 기록하고, <br/>
      목표를 달성하며 성장하는 과정을 <br/>
      친구들과 공유하세요 🚀
    </p>

    <div class="btn-list">
      <KakaoLoginBtn provider={KakaoOauthProviders} on:click={() => handleLogin(KakaoOauthProviders)} />
    </div>

    <p class="desc">Planet에 로그인하여 나만의 작은 우주를 만들어보세요 🌌</p>
  </div>
</div>

<style>
.container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.intro {
  font-size: 0.95rem;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.btn-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.desc {
  margin-top: 1.8rem;
  font-size: 0.85rem;
  color: var(--text-color);
}
</style>
