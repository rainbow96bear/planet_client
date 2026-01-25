import type { RequestEvent } from '@sveltejs/kit';
import type { GraphQLResponse } from './graphql.types';

export async function graphqlRequest<T>(
  event: RequestEvent,
  url: string,
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  /**
   * 🔑 핵심 포인트
   * - 브라우저 → SvelteKit 서버: 쿠키 자동 포함
   * - SvelteKit 서버 → GraphQL 서버: ❌ 자동 아님
   * → cookie 헤더를 직접 전달해야 함
   */

  const cookie = event.request.headers.get('cookie');

  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  if (cookie) {
    headers.cookie = cookie;
  }

  const res = await event.fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables })
  });

  const json: GraphQLResponse<T> = await res.json();

  if (json.errors?.length) {
    throw new Error(json.errors.map(e => e.message).join(', '));
  }

  if (!json.data) {
    throw new Error('GraphQL response has no data');
  }

  return json.data;
}
