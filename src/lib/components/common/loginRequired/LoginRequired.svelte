<script lang="ts">
  import { goto } from '$app/navigation';
  export let message: string = '로그인이 필요합니다.';
  export let redirectTo: string = '/login';
</script>

<div class="login-required-container">
  <p>{message}</p>
  <button on:click={() => goto(redirectTo)}>로그인 페이지로 이동</button>
</div>

<style>
  .login-required-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    text-align: center;
    padding: 2rem;
    color: var(--text-primary);
  }

  .login-required-container p {
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  .login-required-container button {
    padding: 0.5rem 1rem;
    background: var(--color-primary);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    font-weight: 600;
  }

  .login-required-container button:hover {
    background: var(--color-primary-dark);
  }
</style>
