<script lang="ts">
  // message prop으로 로딩 문구를 받아서 표시, 기본값 지정
  export let message: string = '잠시만 기다려주세요...';
</script>

<div class="loading-container">
  <div class="spinner"></div>
  <p>{message}</p>
</div>

<style>
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    text-align: center;
    padding: 2rem;
    color: var(--text-primary);
  }

  .spinner {
    width: 3rem;
    height: 3rem;
    border: 4px solid var(--border-color);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
