<script lang="ts">
  export let src: string | null = null;
  export let alt: string = '프로필 이미지';
  export let size: number = 48; // px 단위
</script>

<div
  class="profile-image"
  role="img"
  aria-label={alt}
  style="width: {size}px; height: {size}px;"
>
  {#if src}
    <img src={src} alt={alt} />
  {:else}
    🪐
  {/if}
</div>

<style>
.profile-image {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  font-size: calc(var(--size, 48px) / 2);
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
