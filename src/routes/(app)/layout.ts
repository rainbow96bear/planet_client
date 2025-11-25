import { onMount } from 'svelte';
import { auth } from '$lib/stores/auth';
import { theme } from '$lib/stores/theme';
import type { Readable } from 'svelte/store';
import type { LayoutState } from '$lib/types/layout';
import { userProfile } from '$lib/stores/userProfile';

export function initLayout(
  currentPathStore: Readable<string>, 
  setState: (state: Partial<LayoutState>) => void
) {
  onMount(() => {
    // auth subscribe → profileState, theme 업데이트
    const unsubAuth = auth.subscribe(async (tokenState) => {
      const token = tokenState?.access_token;
      if (!token) {
        theme.setTheme('light');
        userProfile.set(null);
        return;
      }

      try {
        const [profileRes, themeRes] = await Promise.all([
          fetch('/api/me/profile', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/me/theme', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const profileData = profileRes.ok ? await profileRes.json() : null;
        const themeData = themeRes.ok ? await themeRes.json() : { theme: 'light' };
        console.log(profileData)
        userProfile.set(profileData);
        theme.setTheme(themeData.theme);

      } catch (err) {
        console.error(err);
        userProfile.set(null);
        theme.setTheme('light');
      }
    });

    const unsubPath = currentPathStore.subscribe(path => setState({ currentPath: path }));

    return () => {
      unsubAuth();
      unsubPath();
    };
  });
}
