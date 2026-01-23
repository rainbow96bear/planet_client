<script lang="ts">
  import { goto } from '$app/navigation';
  import styles from './ProfileHeader.module.css';

  function goBack() {
    goto('/');
  }
</script>

<header class={styles.header}>
  <button class={styles.back} on:click={goBack}>
    ←
  </button>

  <h1 class={styles.title}>프로필 설정</h1>
</header>
