import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent }) => {
  const { isLoggedIn, profile } = await parent();

  if (!isLoggedIn || !profile) {
    throw redirect(302, '/login');
  }

  throw redirect(302, `/profile/${profile.nickname}`);
};
