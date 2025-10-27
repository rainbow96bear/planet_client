import { initAuth } from '$lib/stores/auth';
import type { HandleClient } from '@sveltejs/kit';

export const handle: HandleClient = async ({ event, resolve }) => {
	// 모든 네비게이션(페이지 이동)마다 실행
	await initAuth();

	// 이후 라우팅 진행
	return resolve(event);
};
