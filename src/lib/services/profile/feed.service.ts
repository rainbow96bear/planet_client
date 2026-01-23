// src/lib/services/profile/feed.service.ts
export async function loadFeed(nickname: string) {
  try {
    const res = await fetch(`/api/users/${nickname}/feeds`);
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return [];
  }
}
