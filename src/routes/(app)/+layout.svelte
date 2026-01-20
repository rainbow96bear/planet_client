<script lang="ts">
  import Header from '$lib/components/header/Header.svelte';
  import Footer from '$lib/components/footer/Footer.svelte';
  import '$lib/styles/themes.css';

  import styles from './layout.module.css';
	import LeftSidebar from '$lib/components/layout/LeftSidebar/LeftSidebar.svelte';

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
      <!-- <RightSidebar /> -->
    </aside>
  </main>

  <footer class={styles.footer}>
    <Footer />
  </footer>
</div>