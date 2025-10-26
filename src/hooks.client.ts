import { auth, isAccessTokenValid } from '$lib/stores/auth';
import {jwtDecode} from 'jwt-decode';

export async function initAuth() {
  
  if (!isAccessTokenValid()) {
    const res = await fetch('/api/auth/token/access', {
      method: 'POST',
      credentials: 'include' // HttpOnly refresh token 전송
    });

    if (res.ok) {
      const data = await res.json();
      const payload: any = jwtDecode(data.access_token);
      const exp = Math.floor(new Date(payload.exp).getTime() / 1000);
      auth.set({ access_token: data.access_token, access_token_exp: exp });
    } else {
      auth.set({ access_token: null, access_token_exp: null });
    }
  }
}
