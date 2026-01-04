import type { RequestHandler } from './$types';

const USER_SERVER_GRAPHQL = process.env.VITE_USER_SERVER_GRAPHQL!;

export const GET: RequestHandler = async ({ url }) => {
    const field = url.searchParams.get("field");
    const value = url.searchParams.get("value");
    const nickname = value?.trim();

    if (field !== "nickname" || !nickname || nickname.length < 2) {
        return new Response(JSON.stringify({ available: false, message: "invalid request or nickname" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const query = `
            query CheckNicknameAvailability($nickname: String!) {
                checkNicknameAvailability(nickname: $nickname) {
                    available
                    message
                }
            }
        `;

        const res = await fetch(USER_SERVER_GRAPHQL, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                // 필요하다면 인증 헤더 추가
            },
            body: JSON.stringify({
                query,
                variables: { nickname }
            })
        });

        const data = await res.json();

        if (data.errors) {
            console.error("GraphQL error:", data.errors);
            return new Response(JSON.stringify({ available: false, message: "server error" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        const result = data.data.checkNicknameAvailability;
        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ available: false, message: "server error" }), { 
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};
