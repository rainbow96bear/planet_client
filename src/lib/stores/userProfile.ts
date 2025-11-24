import type { UserProfile } from '$lib/types/profile';
import { writable } from 'svelte/store';

export const userProfile = writable<UserProfile | null>(null);
