<script lang="ts">
  import { selectedRoomId } from './+page.svelte';
  import { writable } from 'svelte/store';

  interface Room {
    id: number;
    name: string;
    lastMessage: string;
    unreadCount: number;
  }

  const rooms = writable<Room[]>([
    { id: 1, name: 'Alice', lastMessage: '안녕하세요', unreadCount: 2 },
    { id: 2, name: 'Bob', lastMessage: '오늘 회의?', unreadCount: 0 },
    { id: 3, name: 'Charlie', lastMessage: 'ㅋㅋㅋ', unreadCount: 1 },
  ]);

  const selectRoom = (id: number) => {
    selectedRoomId.set(id);
  };
</script>

<div class="p-2">
  <h2 class="font-bold" style="margin-bottom: 1rem;">채팅방</h2>
  {#each $rooms as room}
    <div
      class="p-2 cursor-pointer hover-bg rounded flex justify-between"
      on:click={() => selectRoom(room.id)}
    >
      <div>
        <div class="font-semibold">{room.name}</div>
        <div class="text-gray" style="font-size: 0.875rem;">{room.lastMessage}</div>
      </div>
      {#if room.unreadCount > 0}
        <div style="background-color:red; color:white; font-size:0.75rem; padding:2px 6px; border-radius:999px;">
          {room.unreadCount}
        </div>
      {/if}
    </div>
  {/each}
</div>
