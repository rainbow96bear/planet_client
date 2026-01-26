// lib/services/profile/profile.service.ts
import { profileStore } from '$lib/stores/profile/profile.store';
import type { Profile, CalendarEvent } from '$lib/stores/profile/profile.types';

export const profileService = {
  applyProfile(profile: Profile) {
    profileStore.setProfile(profile);
  },

  clearProfile() {
    profileStore.setProfile(null);
  },

  applyIsFollowing(isFollowing: boolean | null) {
    profileStore.setIsFollowing(isFollowing);
  },

  applyCalendar(events: CalendarEvent[]) {
    profileStore.setCalendarEvents(events);
  }
};
