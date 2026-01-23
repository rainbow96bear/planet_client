// src/routes/(app)/profile/[nickname]/profile.state.ts
import { user } from '$lib/stores';
import type { UserProfile } from '$lib/types/profile';
import type { CalendarEvent } from '$lib/types/calendar';
import {
  loadProfile,
  loadCalendar,
  loadFeed,
  fetchIsFollowing
} from './profile.api';

export class ProfilePageState {
  nickname: string;

  profile: UserProfile | null = null;
  isMyProfile = false;
  isFollowing: boolean | null = null;

  isLoadingProfile = true;
  isLoadingCalendar = true;
  isLoadingFeed = false;

  calendarEvents: CalendarEvent[] = [];
  feedData: any[] = [];

  activeView: 'calendar' | 'feed' = 'calendar';

  currentYear = new Date().getFullYear();
  currentMonth = new Date().getMonth() + 1;

  constructor(nickname: string) {
    this.nickname = nickname;
  }

  async init() {
    const result = await loadProfile(this.nickname);
    this.profile = result.profile;
    this.isMyProfile = result.isMyProfile;
    this.isLoadingProfile = false;

    if (this.isMyProfile && this.profile) {
      user.update(u => ({
        ...u,
        nickname: this.profile!.nickname,
        profileImage: this.profile!.profileImage,
        bio: this.profile!.bio
      }));
    }

    if (!this.isMyProfile) {
      this.isFollowing = await fetchIsFollowing(this.nickname);
    }

    await this.loadCalendar();
  }

  async loadCalendar() {
    this.isLoadingCalendar = true;
    this.calendarEvents = await loadCalendar(
      this.nickname,
      this.currentYear,
      this.currentMonth
    );
    this.isLoadingCalendar = false;
  }

  async changeMonth(offset: number) {
    let m = this.currentMonth + offset;
    let y = this.currentYear;

    if (m > 12) { m = 1; y++; }
    if (m < 1) { m = 12; y--; }

    this.currentMonth = m;
    this.currentYear = y;

    await this.loadCalendar();
  }

  async switchToFeed() {
    if (this.feedData.length > 0) return;
    this.isLoadingFeed = true;
    this.feedData = await loadFeed(this.nickname);
    this.isLoadingFeed = false;
  }
}
