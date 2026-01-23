// src/lib/services/profile/follow.service.ts
import { get } from 'svelte/store';
import { auth } from '$lib/stores';
import { apiFetch } from '$lib/client/apiFetch';

export async function fetchIsFollowing(
  nickname: string
): Promise<boolean | null> {
  try {
    const token = get(auth)?.accessToken;
    if (!token) return null;

    const res = await apiFetch(`/api/me/follows/${nickname}`, {
      accessToken: token
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.is_following;
  } catch {
    return null;
  }
}
