// src/routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';
// import { env } from '$env/dynamic/private';
// import { graphqlRequest } from '$lib/server/graphqlRequest';
// import { GET_PROFILE } from '$lib/graphql/profile.graphql';

interface UserProfile {
  id: string;
  nickname: string;
  profileImage?: string;
  bio?: string;
  theme: 'light' | 'dark' | string;
  email?: string;
  followerCount?: number;
  followingCount?: number;
}

export const load: LayoutServerLoad = async ({ locals, fetch }) => {
  if (!locals.user) {
    return { isLoggedIn: false };
  }

  try {
    const res = await fetch('/api/me/profile');
    if (!res.ok) throw new Error('Failed to fetch profile');

    const userProfile: UserProfile = await res.json();

    // Profile 타입으로 매핑
    const profile = {
      user_id: userProfile.id,
      nickname: userProfile.nickname,
      profile_image: userProfile.profileImage ?? null,
      bio: userProfile.bio ?? null,
      theme: userProfile.theme,
      email: userProfile.email ?? null,
      followerCount: userProfile.followerCount ?? 0,
      followingCount: userProfile.followingCount ?? 0
    };

    return {
      isLoggedIn: true,
      profile,
      viewerId: locals.user.id
    };
  } catch (err) {
    console.error('[layout.server] profile fetch error:', err);
    return { isLoggedIn: true, profile: null, viewerId: locals.user.id };
  }
};
