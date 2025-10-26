<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  let text = '';
  const dispatch = createEventDispatcher();

  const send = () => {
    if (text.trim() === '') return;
    dispatch('send', text);
    text = '';
  };
</script>

<div style="display:flex; gap:0.5rem;">
  <input
    type="text"
    bind:value={text}
    placeholder="메시지 입력..."
    style="flex:1; border:1px solid #ccc; border-radius:8px; padding:0.5rem;"
    on:keydown={(e) => e.key === 'Enter' && send()}
  />
  <button on:click={send} style="background-color:#3b82f6; color:white; padding:0.5rem 1rem; border-radius:8px;">전송</button>
</div>
