<script lang="ts">
  export let msg: { sender: string; content: string; time: string };
</script>

<div style="display:flex; justify-content:{msg.sender === 'Me' ? 'flex-end' : 'flex-start'};">
  <div style="
    background-color:{msg.sender === 'Me' ? '#3b82f6' : '#e5e5e5'};
    color:{msg.sender === 'Me' ? 'white' : 'black'};
    padding: 0.5rem;
    border-radius: 8px;
    max-width: 250px;
  ">
    <div>{msg.content}</div>
    <div style="font-size:0.75rem; color:#555; text-align:right; margin-top:2px;">{msg.time}</div>
  </div>
</div>
