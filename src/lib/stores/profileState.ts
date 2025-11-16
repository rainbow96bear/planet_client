import type { ProfileState } from '$lib/types/profile';
import { writable } from 'svelte/store';

export const profileState = writable<ProfileState | null>(null);
