<script lang="ts">
  import styles from './LeftSidebar.module.css';
  import NavigationBar from '$lib/components/navigation/NavigationBar/NavigationBar.svelte';
  import type { LeftSidebarVariant } from '.';

  export let variant: LeftSidebarVariant = 'desktop';
</script>

<aside
  class={styles.sidebar}
  data-variant={variant}
>
  <NavigationBar />
</aside>
