<script lang="ts">
  import { onMount } from 'svelte';
  import CalendarForm from '$lib/components/common/calendar/CalendarForm.svelte';
  import LoginRequired from '$lib/components/common/loginRequired/LoginRequired.svelte';

  import {
    initCalendarEditPage,
    submitCalendar,
    cancel,
    type EditCalendarState
  } from './page';

  import styles from './page.module.css';

  let state: EditCalendarState = {
    isLoading: true,
    isLoggedIn: false,
    loginMessage: ''
  };

  onMount(async () => {
    state = await initCalendarEditPage();
  });
</script>

{#if state.isLoading}
  <div class={styles.loadingContainer}>
    <div class={styles.spinner}></div>
    <p>일정 정보를 불러오는 중입니다...</p>
  </div>

{:else if !state.isLoggedIn || state.loginMessage}
  <LoginRequired message={state.loginMessage} />

{:else if state.eventData}
  <CalendarForm
    eventData={state.eventData}
    on:submit={submitCalendar}
    on:cancel={cancel}
  />
{/if}
