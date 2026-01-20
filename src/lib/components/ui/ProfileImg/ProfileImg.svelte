<script lang="ts">
  import styles from './ProfileImg.module.css';

  export let src: string | null = null;
  export let alt = '프로필 이미지';
  export let size = 48; // px
</script>

<div
  class={styles.profileImage}
  style={`--size:${size}px; width:${size}px; height:${size}px;`}
>
  {#if src}
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
    />
  {:else}
    <span aria-hidden="true">🪐</span>
  {/if}
</div>
