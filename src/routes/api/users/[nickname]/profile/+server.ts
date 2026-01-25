// lib/services/profile/profile.service.ts
import { profileStore } from '$lib/stores/profile/profile.store';
import { get } from 'svelte/store';
import type { Profile, CalendarEvent } from '$lib/stores/profile/profile.types';

export const profileService = {
  /**
   * =========================
   * Profile
   * =========================
   */

  async loadMyProfile(fetchFn: typeof fetch = fetch): Promise<void> {
    profileStore.setLoading(true);

    try {
      const res = await fetchFn('/api/me/profile');

      if (!res.ok) {
        throw new Error('내 프로필 조회 실패');
      }

      const profile: Profile = await res.json();
      profileStore.setProfile(profile);
      profileStore.setIsFollowing(null); // 본인은 팔로우 개념 없음
    } catch (err) {
      console.error('[profileService.loadMyProfile]', err);
      profileStore.setProfile(null);
    } finally {
      profileStore.setLoading(false);
    }
  },

  async loadUserProfile(
    nickname: string,
    fetchFn: typeof fetch = fetch
  ): Promise<void> {
    profileStore.setLoading(true);

    try {
      const res = await fetchFn(`/api/users/${nickname}/profile`);

      if (!res.ok) {
        throw new Error('유저 프로필 조회 실패');
      }

      const profile: Profile = await res.json();
      profileStore.setProfile(profile);

      await this.loadIsFollowing(nickname, fetchFn);
    } catch (err) {
      console.error('[profileService.loadUserProfile]', err);
      profileStore.setProfile(null);
    } finally {
      profileStore.setLoading(false);
    }
  },

  async updateProfile(
    input: Partial<Profile>,
    fetchFn: typeof fetch = fetch
  ): Promise<void> {
    try {
      const res = await fetchFn('/api/me/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        throw new Error('프로필 수정 실패');
      }

      const updated: Profile = await res.json();
      profileStore.setProfile(updated);
    } catch (err) {
      console.error('[profileService.updateProfile]', err);
    }
  },

  /**
   * =========================
   * Follow
   * =========================
   */

  async loadIsFollowing(
    nickname: string,
    fetchFn: typeof fetch = fetch
  ): Promise<void> {
    try {
      const res = await fetchFn(`/api/me/follows/${nickname}`);

      if (res.status === 401 || res.status === 403) {
        profileStore.setIsFollowing(null);
        return;
      }

      if (!res.ok) {
        throw new Error('팔로잉 여부 조회 실패');
      }

      const data = await res.json();
      profileStore.setIsFollowing(data.isFollowing);
    } catch (err) {
      console.error('[profileService.loadIsFollowing]', err);
      profileStore.setIsFollowing(null);
    }
  },

  async follow(
    nickname: string,
    fetchFn: typeof fetch = fetch
  ): Promise<void> {
    try {
      const res = await fetchFn(`/api/me/follows/${nickname}`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('팔로우 실패');
      }

      profileStore.setIsFollowing(true);
    } catch (err) {
      console.error('[profileService.follow]', err);
    }
  },

  async unfollow(
    nickname: string,
    fetchFn: typeof fetch = fetch
  ): Promise<void> {
    try {
      const res = await fetchFn(`/api/me/follows/${nickname}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('언팔로우 실패');
      }

      profileStore.setIsFollowing(false);
    } catch (err) {
      console.error('[profileService.unfollow]', err);
    }
  },

  /**
   * =========================
   * Calendar
   * =========================
   */

  async loadCalendar(
    nickname: string,
    year: number,
    month: number,
    fetchFn: typeof fetch = fetch
  ): Promise<void> {
    try {
      const res = await fetchFn(
        `/api/users/${nickname}/calendar?year=${year}&month=${month}`
      );

      if (!res.ok) {
        throw new Error('캘린더 조회 실패');
      }

      const events: CalendarEvent[] = await res.json();
      profileStore.setCalendarEvents(events);
    } catch (err) {
      console.error('[profileService.loadCalendar]', err);
      profileStore.setCalendarEvents([]);
    }
  },
};
