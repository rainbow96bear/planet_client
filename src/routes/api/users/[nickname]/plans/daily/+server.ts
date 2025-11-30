import { error, json, type RequestHandler } from '@sveltejs/kit';

const USER_SERVER_API_URL = process.env.VITE_USER_SERVER_API_URL;

// 💡 일일 계획 조회는 GET 메서드를 사용합니다.
export const GET: RequestHandler = async ({ request, url, params }) => {
    // 1. URL 매개변수에서 닉네임을 추출합니다.
    const nickname = params.nickname;

    // 2. 클라이언트 요청 URL에서 'date' 쿼리 파라미터를 추출합니다.
    const dateString = url.searchParams.get('date');

    if (!nickname) {
        return error(400, { message: '닉네임(nickname)이 누락되었습니다.' });
    }

    if (!dateString) {
        return error(400, { message: '날짜(date) 쿼리 파라미터가 누락되었습니다.' });
    }

    // Authorization 헤더 추출 (다른 사용자의 계획을 보더라도 인증은 필요)
    const authorizationHeader = request.headers.get('authorization');
    
    if (!authorizationHeader) {
        // 보안 검증
        return error(401, { message: '인증 헤더가 누락되었습니다.' });
    }

    try {
        // 3. GoLang 백엔드 API의 'users/[nickname]/daily-plans' 엔드포인트로 요청을 프록시합니다.
        // 닉네임과 날짜 쿼리 파라미터를 모두 백엔드 URL에 포함합니다.
        const res = await fetch(`${USER_SERVER_API_URL}/users/${nickname}/plans/daily?date=${dateString}`, { 
            method: 'GET', 
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': authorizationHeader,
            }, 
        });

        if (!res.ok) {
            // 백엔드 오류를 클라이언트에 전달합니다.
            const errorData = await res.json().catch(() => ({ message: '백엔드 오류' }));
            return error(res.status, errorData);
        }

        const data = await res.json();
        // GoLang 백엔드의 응답을 클라이언트에 JSON으로 반환합니다.
        return json(data);
        
    } catch (e) {
        console.error('API 프록시 오류:', e);
        return error(500, { message: '내부 서버 오류' });
    }
};