import { writable } from 'svelte/store';
import type { LayoutState } from '$lib/types/layout';

// Layout 상태 store
export const layoutState = writable<LayoutState>({
  currentPath: ''
});
