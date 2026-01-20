// NavigationBar.ts
export type NavItem = {
  path: string;
  label: string;
  icon: string;
  auth?: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { path: '/explore', label: '탐색', icon: '🌍' },
  { path: '/notifications', label: '알림', icon: '🔔', auth: true },
  { path: '/messages', label: '메시지', icon: '💬', auth: true },
  { path: '/bookmarks', label: '북마크', icon: '🔖', auth: true },
  { path: '/settings', label: '설정', icon: '⚙️', auth: true }
];
