<script lang="ts">
  import styles from './AccountActions.module.css';
  import { user } from '$lib/stores/user';

  function logout() {
    user.set(null);
  }
</script>

<section class={styles.dangerZone}>
  <button class={styles.logout} on:click={logout}>
    로그아웃
  </button>
</section>
