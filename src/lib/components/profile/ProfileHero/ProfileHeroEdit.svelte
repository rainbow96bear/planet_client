<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { User } from '$lib/types/user';
  import styles from './profile-hero.module.css';

  export let user: User;

  let nickname = user.nickname ?? '';
  let bio = user.bio ?? '';

  const dispatch = createEventDispatcher<{
    cancel: void;
    save: { nickname: string; bio: string };
  }>();

  function handleSave() {
    dispatch('save', { nickname, bio });
  }
</script>

<section class={styles.hero}>
  <div class={styles.editForm}>
    <input
      class={styles.input}
      type="text"
      bind:value={nickname}
      placeholder="닉네임"
      maxlength={20}
    />

    <textarea
      class={styles.textarea}
      bind:value={bio}
      placeholder="자기소개"
      rows={3}
    />

    <div class={styles.actions}>
      <button class={styles.save} on:click={handleSave}>
        저장
      </button>
      <button class={styles.cancel} on:click={() => dispatch('cancel')}>
        취소
      </button>
    </div>
  </div>
</section>
