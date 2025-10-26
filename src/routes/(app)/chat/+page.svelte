<script lang="ts">
  import ChatRoomList from './ChatRoomList.svelte';
  import ChatWindow from './ChatWindow.svelte';
  import { writable } from 'svelte/store';

  export const selectedRoomId = writable<number | null>(null);
</script>

<link rel="stylesheet" href="./chat.css" />

<div class="flex h-screen">
  <!-- 좌측 채팅방 목록 -->
  <div style="width: 33%;" class="border-r overflow-auto">
    <ChatRoomList />
  </div>

  <!-- 우측 메시지 영역 -->
  <div class="flex-1 flex flex-col">
    <ChatWindow />
  </div>
</div>
