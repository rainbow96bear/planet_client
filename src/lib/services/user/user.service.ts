import { apiFetch } from '$lib/client/apiFetch';
import type { Theme } from './user.types';

export async function fetchUserProfileApi(token: string) {
  const res = await apiFetch('/api/me/profile', { accessToken: token });
  return res.json();
}

export async function updateThemeApi(
  token: string,
  nickname: string | null,
  theme: Theme
) {
  return apiFetch('/api/me/theme', {
    method: 'PATCH',
    body: JSON.stringify({ nickname, theme }),
    accessToken: token
  });
}

export async function updateProfileApi(
  token: string,
  payload: {
    nickname: string;
    bio: string;
    profile_image?: string;
  }
) {
  return apiFetch('/api/me/profile', {
    method: 'PATCH',
    body: JSON.stringify(payload),
    accessToken: token
  });
}

export async function checkNicknameAvailabilityApi(
  token: string,
  nickname: string
) {
  return apiFetch(
    `/api/account/availability?field=nickname&value=${encodeURIComponent(nickname)}`,
    { accessToken: token }
  );
}
