<script lang="ts">
  import { onMount } from 'svelte';
  import CalendarForm from '$lib/components/common/calendar/CalendarForm.svelte';
  import LoginRequired from '$lib/components/common/loginRequired/LoginRequired.svelte';

  import {
    initCalendarAddPage,
    submitCalendar,
    cancel,
    type AddCalendarState
  } from './page';

  import styles from './page.module.css';

  let state: AddCalendarState = {
    isLoading: true,
    isLoggedIn: false,
    loginMessage: ''
  };

  onMount(() => {
    state = initCalendarAddPage();
  });
</script>

{#if state.isLoading}
  <div class={styles.loadingContainer}>
    <div class={styles.spinner}></div>
    <p>잠시만 기다려주세요...</p>
  </div>

{:else if !state.isLoggedIn}
  <LoginRequired message={state.loginMessage} />

{:else}
  <CalendarForm
    on:submit={submitCalendar}
    on:cancel={cancel}
  />
{/if}
