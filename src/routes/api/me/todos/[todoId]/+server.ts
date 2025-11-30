import { error, json, type RequestHandler } from '@sveltejs/kit';

const USER_SERVER_API_URL = process.env.VITE_USER_SERVER_API_URL;


export const PATCH: RequestHandler = async ({ request, params }) => {
    // 1. 클라이언트에서 JSON으로 보낸 데이터를 읽습니다.
    const body = await request.json(); 
    // body는 { IsDone: boolean } 형태일 것입니다.
    
    // URL 매개변수에서 todoId를 가져옵니다.
    const todoId = params.todoId; 

    // Authorization 헤더 추출 (클라이언트에서 전달된 것을 그대로 사용)
    const authorizationHeader = request.headers.get('authorization');
    
    if (!authorizationHeader) {
        // 보안 검증 (hooks에서 이미 했더라도 이중 확인)
        return error(401, { message: '인증 헤더가 누락되었습니다.' });
    }

    try {
        // 2. GoLang 백엔드 API로 요청을 프록시(대리 전송)합니다.
        const res = await fetch(`${USER_SERVER_API_URL}/me/todos/${todoId}`, { 
            method: 'PATCH',
            headers: { 
                // JSON임을 명시하고, Authorization 헤더를 전달합니다.
                'Content-Type': 'application/json',
                'Authorization': authorizationHeader,
            }, 
            // 3. 클라이언트에서 받은 JSON 객체를 GoLang 백엔드에 그대로 JSON으로 전송합니다.
            body: JSON.stringify(body)
        });
        if (!res.ok) {
            // 백엔드 오류를 클라이언트에 전달합니다.
            const errorData = await res.json().catch(() => ({ message: '백엔드 오류' }));
            return error(res.status, errorData);
        }

        if (res.status === 204) {
            // 💡 핵심 수정: 204 No Content일 경우, 본문 없이 204 응답을 반환합니다.
            //    res.json() 호출을 피해야 합니다.
            return new Response(null, { status: 204 }); 
        }
        
        const data = await res.json();
        // GoLang 백엔드의 응답을 클라이언트에 JSON으로 반환합니다.
        return json(data);
        
    } catch (e) {
        console.error('API 프록시 오류:', e);
        return error(500, { message: '내부 서버 오류' });
    }
};