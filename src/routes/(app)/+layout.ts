import type { LayoutLoad } from './$types';
import { initAuth } from '$lib/stores/auth';

export const load: LayoutLoad = async ({ fetch }) => {
    // Access Token 갱신 (쿠키의 Refresh Token 사용)
    await initAuth({ fetch });
    return {};
};