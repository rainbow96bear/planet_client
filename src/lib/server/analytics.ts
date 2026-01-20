type TrackEventParams = {
  eventName: string;
  locals: App.Locals;
  properties?: Record<string, any>;
};

const ANALYTICS_SERVER_GRAPHQL = process.env.VITE_ANALYTICS_SERVER_GRAPHQL!;

export async function trackEvent({
  eventName,
  locals,
  properties = {}
}: TrackEventParams) {
  // client_id는 무조건 있음
  const body = {
    event_name: eventName,
    client_id: locals.clientId,
    user_id: locals.user?.id ?? null,
    occurred_at: new Date().toISOString(),
    properties
  };

  // 실패해도 서비스 흐름은 막지 않음
  try {
    await fetch(`${ANALYTICS_SERVER_GRAPHQL}/event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch {
    // 로그만 찍거나 무시
  }
}
