export async function fetchWithToken(
  url: string,
  accessToken: string | null = null,
  options: RequestInit = {}
) {
  // 1. 새 Headers 생성
  const headers = new Headers();

  // 2. options.headers가 있다면 그대로 복사
  if (options.headers) {
    const optHeaders = new Headers(options.headers as HeadersInit);
    optHeaders.forEach((value, key) => {
      headers.set(key, value);
    });
  }

  // 3. Authorization 헤더는 가장 마지막에 "강제로" 덮어쓰기
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  // 4. fetch 실행
  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}