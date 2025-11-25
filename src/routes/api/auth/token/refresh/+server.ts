// src/routes/api/auth/refresh/+server.ts 또는 적절한 경로
import type { RequestHandler } from "@sveltejs/kit";

const AUTH_SERVER_API_URL = process.env.VITE_AUTH_SERVER_API_URL;

export const POST: RequestHandler = async ({ request }) => {
	try {
		// 1. 클라이언트가 보낸 쿠키 헤더를 그대로 읽음 (Refresh Token 포함)
		const cookieHeader = request.headers.get("cookie") ?? "";

		// 2. 백엔드 인증 서버로 요청 프록시 (이전 논의에 따라 '/auth/token/refresh' 대신 '/auth/refresh' 사용 권장)
		const res = await fetch(`${AUTH_SERVER_API_URL}/auth/refresh`, {
			method: "POST",
			headers: {
				// ✅ 핵심: 클라이언트의 Refresh Token이 포함된 Cookie 헤더를 백엔드에 전달
				"Cookie": cookieHeader,
			},
			// body 생략 (대부분의 Refresh 로직은 쿠키로 처리되므로)
			redirect: 'manual'
		});

		// 3. 백엔드의 응답 본문과 상태를 그대로 읽음
		const resText = await res.text();
		
		// 4. 백엔드 응답의 모든 헤더를 복사하여 전달할 새 Headers 객체 생성
		const newHeaders = new Headers();
		
		// 백엔드에서 온 모든 헤더를 복사
		res.headers.forEach((value, key) => {
			// ✅ 핵심: 백엔드에서 설정된 새로운 'set-cookie' 헤더를 프론트엔드에 그대로 전달
			// 'set-cookie'는 여러 개일 수 있으므로 append를 사용
			newHeaders.append(key, value);
		});
		
		// 5. 응답 본문, 상태 코드, 복사된 헤더를 포함하여 최종 응답 반환
		return new Response(resText, {
			status: res.status,
			headers: newHeaders
		});

	} catch (err) {
		console.error('Refresh token proxy failed:', err);
		return new Response(JSON.stringify({ error: 'Refresh token proxy failed' }), { status: 500 });
	}
};