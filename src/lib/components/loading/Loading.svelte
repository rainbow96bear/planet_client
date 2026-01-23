<script lang="ts">
  import styles from './Loading.module.css';

  export let message = '로딩 중';
</script>

<div class={styles.container} role="status" aria-live="polite">
  <div class={styles.spinner} />
  <p class={styles.text}>{message}</p>
</div>
