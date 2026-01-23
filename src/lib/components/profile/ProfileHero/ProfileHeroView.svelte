<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { User } from '$lib/types/user';
  import styles from './profile-hero.module.css';

  export let user: User;

  const dispatch = createEventDispatcher();
</script>

<section class={styles.hero}>
  <img
    class={styles.avatar}
    src={user.profileImage ?? '/images/default-avatar.png'}
    alt="프로필 이미지"
  />

  <div class={styles.info}>
    <h1 class={styles.nickname}>
      {user.nickname ?? '익명 사용자'}
    </h1>

    <p class={styles.bio}>
      {user.bio || '자기소개가 아직 없어요.'}
    </p>
  </div>

  <button
    class={styles.editButton}
    on:click={() => dispatch('edit')}
  >
    편집
  </button>
</section>
