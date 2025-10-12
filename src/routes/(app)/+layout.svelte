<script lang="ts">
    import ThemeToggleBtn from '$lib/components/themeToggleBtn.svelte';
</script>

<!-- 페이지 내용 -->
<main>

    <slot />
</main>

<!-- 테마 토글 버튼 -->
<ThemeToggleBtn></ThemeToggleBtn>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }

  :global(html) {
    box-sizing: border-box;
  }

  :global(*) {
    box-sizing: inherit;
  }
    
  main {
    padding: 2rem;
    min-width: 100%;
    min-height: 100%;
    display: flex;            /* 페이지 내용 가운데 정렬 같은 경우 */
    justify-content: center;
    align-items: center;
  }

</style>