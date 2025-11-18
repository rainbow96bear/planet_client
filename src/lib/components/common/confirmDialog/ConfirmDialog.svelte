<!-- src/lib/components/common/confirm/ConfirmDialog.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  export let message: string = '정말로 진행하시겠습니까?';
  export let isOpen: boolean = false;

  const dispatch = createEventDispatcher();

  function onConfirm() {
    dispatch('confirm'); // 확인 클릭 시 이벤트 전달
    isOpen = false;
  }

  function onCancel() {
    dispatch('cancel'); // 취소 클릭 시 이벤트 전달
    isOpen = false;
  }
</script>

{#if isOpen}
  <div class="overlay" on:click={onCancel}>
    <div class="dialog" on:click|stopPropagation>
      <p>{message}</p>
      <div class="buttons">
        <button on:click={onConfirm}>확인</button>
        <button on:click={onCancel}>취소</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed; inset:0;
    background: rgba(0,0,0,0.4);
    display: flex; justify-content:center; align-items:center;
    z-index: 1000;
  }
  .dialog {
    background: white; padding: 1rem 1.5rem;
    border-radius: 0.5rem; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  }
  .buttons { display: flex; gap: 0.5rem; justify-content: flex-end; margin-top:1rem; }
</style>
