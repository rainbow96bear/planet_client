import { writable, derived } from 'svelte/store';

export interface AuthUser {
  id: string;
  nickname: string;
  profileImage?: string;
}

interface AuthState {
  user: AuthUser | null;
}

function createAuthStore() {
  const store = writable<AuthState>({
    user: null
  });

  const isLoggedIn = derived(store, $s => !!$s.user);

  return {
    subscribe: store.subscribe, // ⭐ 이게 핵심
    isLoggedIn,

    setUser(user: AuthUser) {
      store.set({ user });
    },

    clear() {
      store.set({ user: null });
    }
  };
}

export const authStore = createAuthStore();
