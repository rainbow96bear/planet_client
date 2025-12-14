// $lib/client/apiFetch.ts
export async function apiFetch(
  url: string,
  options: RequestInit & { accessToken?: string } = {}
): Promise<Response> {
  const headers = new Headers(options.headers);

  if (options.accessToken) {
    headers.set('Authorization', `Bearer ${options.accessToken}`);
  }

  // JSON 요청 기본 처리
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include'
  });

  return response;
}
