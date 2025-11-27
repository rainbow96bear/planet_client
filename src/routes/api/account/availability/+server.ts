import type { RequestHandler } from "@sveltejs/kit";

const AUTH_SERVER_API_URL = process.env.VITE_AUTH_SERVER_API_URL;

export const GET: RequestHandler = async ({ url }) => {
    // 1. 클라이언트 요청에서 'field'와 'value' 파라미터를 추출
    const field = url.searchParams.get("field");
    const value = url.searchParams.get("value");
    // 이전에 nickname을 받던 로직을 field와 value에 맞춰 수정합니다.
    const nickname = value; // 닉네임 유효성 검사에서 'value'가 닉네임입니다.

    // 2. 닉네임 유효성 검사 (최소 길이 2자)
    // 'field'가 'nickname'이 아닐 경우도 처리하려면 로직이 더 필요하지만, 
    // 현재는 nickname 검사에 초점을 맞춥니다.
    if (field !== "nickname" || !nickname || nickname.trim().length < 2) {
        return new Response(JSON.stringify({ available: false, error: "invalid request or nickname" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        // 3. 백엔드 서버 URL 구성: 
        // 클라이언트로부터 받은 'field'와 'value'를 백엔드로 그대로 전달합니다.
        const res = await fetch(
            `${AUTH_SERVER_API_URL}/account/availability?field=${encodeURIComponent(field)}&value=${encodeURIComponent(nickname)}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            }
        );

        // 4. 백엔드 응답을 클라이언트로 프록시
        const data = await res.json();
        return new Response(JSON.stringify(data), {
            status: res.status,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ available: false, error: "server error" }), { status: 500 });
    }
};