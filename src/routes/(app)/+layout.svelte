<script lang="ts">
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import LeftSidebar from '$lib/components/layout/LeftSidebar/LeftSidebar.svelte';
  import '$lib/styles/themes.css';
  import styles from './layout.module.css';
  import { profileStore } from '$lib/stores/profile/profile.store';

  import type { Profile } from '$lib/stores/profile/profile.types';

  export let data: {
    profile: Profile | null;
  };

  // ✅ data 변경에 반응하도록 reactive 처리
  $: {
    if (data.profile) {
      profileStore.setProfile(data.profile);
    } 
  }
</script>

<div class={styles.layout}>
  <header class={styles.header}>
    <Header />
  </header>

  <main class={styles.main}>
    <aside class={styles.left}>
      <LeftSidebar />
    </aside>

    <section class={styles.content}>
      <slot />
    </section>

    <aside class={styles.right}>
      <!-- RightSidebar 필요 시 추가 -->
    </aside>
  </main>

  <footer class={styles.footer}>
    <Footer />
  </footer>
</div>
