import type { LayoutLoad } from './$types';
import { initAuth } from '$lib/stores/auth';

export const load: LayoutLoad = async ({ fetch }) => {
    // 클라이언트에서 token 갱신
    await initAuth({ fetch });
    return {};
};
