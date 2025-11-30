import { error, json, type RequestHandler } from '@sveltejs/kit';

const USER_SERVER_API_URL = process.env.VITE_USER_SERVER_API_URL;

// 💡 일일 계획 조회는 GET 메서드를 사용합니다.
export const GET: RequestHandler = async ({ request, url }) => {
    // 1. 클라이언트 요청 URL에서 'date' 쿼리 파라미터를 추출합니다.
    const dateString = url.searchParams.get('date');

    if (!dateString) {
        return error(400, { message: '날짜(date) 쿼리 파라미터가 누락되었습니다.' });
    }

    // Authorization 헤더 추출 (클라이언트에서 전달된 것을 그대로 사용)
    const authorizationHeader = request.headers.get('authorization');
    
    if (!authorizationHeader) {
        // 보안 검증
        return error(401, { message: '인증 헤더가 누락되었습니다.' });
    }

    try {
        // 2. GoLang 백엔드 API의 일일 계획 엔드포인트로 요청을 프록시(대리 전송)합니다.
        // 쿼리 파라미터는 추출한 dateString을 사용하여 백엔드 URL에 직접 추가합니다.
        const res = await fetch(`${USER_SERVER_API_URL}/me/plans/daily?date=${dateString}`, { 
            method: 'GET', // 💡 GET 메서드로 지정
            headers: { 
                // JSON 응답을 기대하고, Authorization 헤더를 전달합니다.
                'Content-Type': 'application/json',
                'Authorization': authorizationHeader,
            }, 
            // 💡 GET 요청이므로 body 필드는 생략합니다.
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