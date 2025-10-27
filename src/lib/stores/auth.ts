import { writable } from 'svelte/store';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  access_token: string | null;
  exp: number | null;
  user_uuid: string | null;
  nickname: string | null;
}

export const auth = writable<AuthState>({
  access_token: null,
  exp: null,
  user_uuid: null,
  nickname: null,
});

export function isAccessTokenValid(): boolean {
	let valid = false;
	auth.update((a:any) => {
		if (a.access_token && a.exp) {
			// 만료 30초 전까지는 유효하다고 간주
			valid = Date.now() < a.exp * 1000 - 30_000;
		}
		return a;
	});
	return valid;
}

let refreshing = false;

export async function initAuth() {
	if (refreshing) return;
	if (isAccessTokenValid()) return;

	refreshing = true;

	try {
		const res = await fetch('/api/auth/token/access', {
			method: 'POST',
			credentials: 'include' // HttpOnly refresh token 쿠키 전송
		});

		if (!res.ok) {
			auth.set({ 
				access_token: null, 
				exp: null, 
				user_uuid: null, 
				nickname:null 
			});
			return;
		}

		  const data = await res.json();
		  const decoded: any = jwtDecode(data.access_token);
		  const exp = Math.floor(new Date(decoded.exp).getTime() / 1000);
		  auth.set({
		  	access_token: data.access_token,
			exp: exp,
			user_uuid: decoded.user_uuid,
			nickname: decoded.nickname,
		  });
	} catch (err) {
		console.error('token refresh failed', err);
		auth.set({ 
			access_token: null, 
			exp: null, 
			user_uuid: null, 
			nickname:null
		});
	} finally {
		refreshing = false;
	}
}
