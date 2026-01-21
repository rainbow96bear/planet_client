<script lang="ts">
  import styles from './FeedEmpty.module.css';

  export let title = '표시할 피드가 없어요';
  export let description = '새로운 사람을 팔로우하거나 글을 작성해보세요.';
</script>

<div class={styles.container} role="status" aria-live="polite">
  <div class={styles.icon} aria-hidden="true">🫧</div>

  <div class={styles.text}>
    <p class={styles.title}>{title}</p>
    <p class={styles.description}>{description}</p>
  </div>
</div>
