// src/lib/server/graphqlRequest.ts
interface GraphQLError {
  message: string;
  extensions?: Record<string, any>;
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: GraphQLError[];
}

export async function graphqlRequest<T = any>(
  url: string,
  query: string,
  variables?: Record<string, any>,
  options: {
    headers?: Record<string, string>;
    authToken?: string; // Authorization이 필요한 경우
  } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (options.authToken) {
    headers['Authorization'] = `Bearer ${options.authToken}`;
  }

  let response: Response;
  let result: GraphQLResponse<T>;

  try {
    response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables })
    });

    const text = await response.text();
    try {
      result = JSON.parse(text) as GraphQLResponse<T>;
    } catch {
      console.error('Failed to parse GraphQL response:', text);
      throw new Error('Invalid GraphQL response');
    }

  } catch (err) {
    console.error('GraphQL request failed:', err);
    throw new Error('Failed to send GraphQL request');
  }

  // GraphQL 서버 에러 로그
  if (result.errors && result.errors.length > 0) {
    console.error('GraphQL returned errors:', result.errors);
    throw new Error(result.errors.map(e => e.message).join(', '));
  }

  if (!response.ok) {
    console.error('HTTP error:', response.status, await response.text());
    throw new Error(`HTTP error ${response.status}`);
  }

  return result.data as T;
}
