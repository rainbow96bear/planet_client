import { graphqlRequest } from './graphqlClient';
import { tokenIsExpired } from '$lib/utils/jwt';
import { UnauthorizedError } from './errors';

/**
 * access token 자동 갱신을 포함한 GraphQL 요청
 * ❗ redirect 처리하지 않음 (호출부에서 처리)
 */
export async function graphqlWithAuth<T= any>(
  url: string,
  query: string,
  variables: Record<string, any> = {},
  event: any
): Promise<T> {
  const authHeader = event.request.headers.get('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('missing access token');
  }

  const accessToken = authHeader.slice(7);

  if (tokenIsExpired(accessToken)) {
    throw new UnauthorizedError('expired access token');
  }

  try {
    return await graphqlRequest<T>(url, query, variables, {
      authToken: accessToken
    });
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      throw err;
    }
    throw err;
  }
}