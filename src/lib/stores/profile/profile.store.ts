// lib/stores/profile/profile.store.ts
import { writable, derived } from 'svelte/store';
import type { Profile, CalendarEvent, ProfileStoreState } from './profile.types';

function createProfileStore() {
  const initialState: ProfileStoreState = {
    profile: null,
    calendarEvents: [],
    isFollowing: null,
    loading: false,
    error: null,
    viewerId: null
  };

  const store = writable<ProfileStoreState>(initialState);

  const profile = derived(store, $s => $s.profile);
  const loading = derived(store, $s => $s.loading);
  const error = derived(store, $s => $s.error);
  const isOwnProfile = derived(store, $s =>
    $s.profile ? $s.viewerId === $s.profile.user_id : false
  );

  return {
    profile,
    loading,
    error,
    isOwnProfile,
    subscribe: store.subscribe,
    setProfile: (profile: Profile | null, viewerId?: string) =>
      store.update(s => ({ ...s, profile, viewerId: viewerId ?? s.viewerId, error: null })),
    setLoading: (loading: boolean) => store.update(s => ({ ...s, loading })),
    setError: (error: string | null) => store.update(s => ({ ...s, error })),
    reset: () => store.set(initialState)
  };
}

export const profileStore = createProfileStore();
