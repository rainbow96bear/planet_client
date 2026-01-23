<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { User } from '$lib/types/user';

  import ProfileHeroView from './ProfileHeroView.svelte';
  import ProfileHeroEdit from './ProfileHeroEdit.svelte';

  export let user: User;
  export let editable = false;

  const dispatch = createEventDispatcher<{
    edit: void;
    cancel: void;
    save: { nickname: string; bio: string };
  }>();
</script>

{#if editable}
  <ProfileHeroEdit
    {user}
    on:cancel={() => dispatch('cancel')}
    on:save={(e) => dispatch('save', e.detail)}
  />
{:else}
  <ProfileHeroView
    {user}
    on:edit={() => dispatch('edit')}
  />
{/if}
