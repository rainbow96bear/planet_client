import { graphqlRequest } from './graphqlClient';
import { UnauthorizedError } from './errors';
import type { RequestEvent } from '@sveltejs/kit';

export async function graphqlWithAuth<T = any>(
  url: string,
  query: string,
  variables: Record<string, any>,
  event: RequestEvent
): Promise<T> {
  const accessToken = event.locals.accessToken;

  if (!accessToken) {
    throw new UnauthorizedError('unauthorized');
  }

  return graphqlRequest<T>(url, query, variables, {
    authToken: accessToken
  });
}
