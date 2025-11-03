import { writable } from 'svelte/store';
import type { UserProfile } from '$lib/types/profile';

export const userProfile = writable<UserProfile | null>(null);
