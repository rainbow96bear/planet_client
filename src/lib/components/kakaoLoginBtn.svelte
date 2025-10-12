<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Provider } from "LoginProvider";

  export let provider: Provider;
  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch('click'); // 부모에게 이벤트 전달
  }
</script>

<button class="login-btn kakao" on:click={handleClick}>
  <img src={provider.icon} alt="{provider.name} icon" />
  <span>{provider.name}로 시작하기</span>
</button>

<style>
.login-btn.kakao {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.8rem 1rem;
  border-radius: 0.6rem;
  background: var(--button-bg);
  color: var(--button-text);
  font-weight: bold;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}
.login-btn.kakao img {
  height: 32px;
}
</style>
