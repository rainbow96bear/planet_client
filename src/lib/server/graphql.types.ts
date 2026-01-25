// src/lib/server/graphqlClient.ts
import type { RequestEvent } from '@sveltejs/kit';

interface GraphQLError {
  message: string;
}

export interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

export async function graphqlRequest<T>(
  event: RequestEvent,
  url: string,
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  const token = event.cookies.get('access_token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
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
