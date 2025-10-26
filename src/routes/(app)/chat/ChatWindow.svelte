<script lang="ts">
  import { selectedRoomId } from './+page.svelte';
  import Message from './Message.svelte';
  import MessageInput from './MessageInput.svelte';
  import { writable, derived } from 'svelte/store';

  interface MessageType {
    id: number;
    sender: string;
    content: string;
    time: string;
  }

  const allMessages = writable<Record<number, MessageType[]>>({
    1: [
      { id: 1, sender: 'Alice', content: '안녕하세요', time: '10:00' },
      { id: 2, sender: 'Me', content: '안녕하세요!', time: '10:01' },
    ],
    2: [],
    3: [],
  });

  const messages = derived(
    [selectedRoomId, allMessages],
    ([$selectedRoomId, $allMessages]) => $selectedRoomId ? $allMessages[$selectedRoomId] || [] : []
  );

  const sendMessage = (content: string) => {
    selectedRoomId.subscribe(id => {
      if (!id) return;
      allMessages.update(msgs => {
        const roomMsgs = msgs[id] || [];
        roomMsgs.push({
          id: roomMsgs.length + 1,
          sender: 'Me',
          content,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
        msgs[id] = roomMsgs;
        return msgs;
      });
    })();
  };
</script>

{#if $selectedRoomId === null}
  <div class="flex-1 flex items-center justify-center text-gray">
    채팅방을 선택하세요
  </div>
{:else}
  <div class="flex-1 flex flex-col">
    <div class="flex-1 overflow-auto p-4" style="display:flex; flex-direction:column; gap:0.5rem;">
      {#each $messages as msg}
        <Message {msg} />
      {/each}
    </div>
    <div class="border-t p-2">
      <MessageInput on:send={e => sendMessage(e.detail)} />
    </div>
  </div>
{/if}
