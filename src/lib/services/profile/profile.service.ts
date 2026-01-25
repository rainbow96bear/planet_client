// lib/services/profile.service.ts
import { profileStore } from '$lib/stores/profile/profile.store';
import { user, auth } from '$lib/stores';
import { get } from 'svelte/store';
import { apiFetch } from '$lib/client/apiFetch';
import type { Profile, CalendarEvent } from '$lib/stores/profile/profile.types';

export const profileService = {
  async loadProfile(nickname: string, isMyProfile: boolean): Promise<void> {
    profileStore.setLoading(true);
    
    try {
      const endpoint = isMyProfile
        ? `/api/me/profile`
        : `/api/users/${nickname}/profile`;
      
      const token = isMyProfile ? get(auth)?.accessToken : undefined;
      const res = await apiFetch(endpoint, { accessToken: token });
      
      if (!res.ok) {
        throw new Error('프로필 조회 실패');
      }
      
      const data: Profile = await res.json();
      profileStore.setProfile(data);
      
      // 내 프로필이 아니면 팔로잉 여부 조회
      if (!isMyProfile) {
        await this.loadIsFollowing(nickname);
      }
    } catch (error) {
      console.error('[profileService.loadProfile]', error);
      profileStore.setProfile(null);
    } finally {
      profileStore.setLoading(false);
    }
  },

  async loadIsFollowing(nickname: string): Promise<void> {
    try {
      const token = get(auth)?.accessToken;
      const res = await apiFetch(`/api/me/follows/${nickname}`, {
        accessToken: token
      });

      if (res.status === 401 || res.status === 403) {
        profileStore.setIsFollowing(null);
        return;
      }

      if (!res.ok) throw new Error('팔로잉 여부 조회 실패');

      const data = await res.json();
      profileStore.setIsFollowing(data.is_following);
    } catch (error) {
      console.error('[profileService.loadIsFollowing]', error);
      profileStore.setIsFollowing(null);
    }
  },

  async loadCalendar(
    nickname: string,
    year: number,
    month: number
  ): Promise<void> {
    try {
      const isMine = get(user)?.nickname === nickname;
      let url = isMine
        ? `/api/me/calendar`
        : `/api/users/${nickname}/calendar`;
      
      url += `?year=${year}&month=${month}`;
      const token = isMine ? get(auth)?.accessToken : undefined;

      const res = await apiFetch(url, { accessToken: token });
      
      if (!res.ok) throw new Error('캘린더 조회 실패');

      const events: CalendarEvent[] = await res.json();
      profileStore.setCalendarEvents(events);
    } catch (error) {
      console.error('[profileService.loadCalendar]', error);
      profileStore.setCalendarEvents([]);
    }
  },

  async follow(nickname: string): Promise<void> {
    try {
      const token = get(auth)?.accessToken;
      const res = await apiFetch(`/api/me/follows/${nickname}`, {
        method: 'POST',
        accessToken: token
      });

      if (!res.ok) throw new Error('팔로우 실패');

      profileStore.setIsFollowing(true);
      
      // 팔로워 수 증가 (낙관적 업데이트)
      // 필요시 프로필 다시 로드
    } catch (error) {
      console.error('[profileService.follow]', error);
    }
  },

  async unfollow(nickname: string): Promise<void> {
    try {
      const token = get(auth)?.accessToken;
      const res = await apiFetch(`/api/me/follows/${nickname}`, {
        method: 'DELETE',
        accessToken: token
      });

      if (!res.ok) throw new Error('언팔로우 실패');

      profileStore.setIsFollowing(false);
    } catch (error) {
      console.error('[profileService.unfollow]', error);
    }
  }
};