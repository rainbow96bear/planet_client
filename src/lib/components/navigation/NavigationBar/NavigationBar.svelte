<script lang="ts">
  import { page } from '$app/stores';
  import { user, isLoggedIn } from '$lib/stores';
  import styles from './NavigationBar.module.css';
  import ProfileImg from '$lib/components/ui/ProfileImg/ProfileImg.svelte';
  import { NAV_ITEMS } from '.';


  const isActive = (path: string) =>
    $page.url.pathname.startsWith(path);
</script>

<nav class={styles.sidebarContent}>
  <ul class={styles.navMenu}>
    {#each NAV_ITEMS as item}
      <!-- {#if !item.auth || ($isLoggedIn && $user?.id)} -->
        <li>
          <a
            href={item.path}
            class={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
          >
            <span class={styles.navIcon}>{item.icon}</span>
            <span class={styles.navText}>{item.label}</span>
          </a>
        </li>
      <!-- {/if} -->
    {/each}
  </ul>

  {#if $isLoggedIn && $user?.id}
    <a href="/calendar/new" class={styles.createBtn}>
      <span class={styles.createIcon}>✏️</span>
      <span>새 할 일 작성</span>
    </a>

    <a href="/profile" class={styles.userProfile}>
      <ProfileImg
        src={$user.profileImage}
        alt={$user.nickname || '프로필'}
        size={40}
      />
      <div class={styles.profileInfo}>
        <div class={styles.profileName}>
          { $user.nickname } 프로필
        </div>
      </div>
    </a>
  {/if}
</nav>
