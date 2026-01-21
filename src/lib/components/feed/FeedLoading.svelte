<script lang="ts">
  import styles from './FeedLoading.module.css';

  export let message = '피드를 불러오는 중이에요';
</script>

<div class={styles.container} role="status" aria-live="polite">
  <div class={styles.spinner} />
  <p class={styles.text}>{message}</p>
</div>
