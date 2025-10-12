import type { RequestHandler } from "@sveltejs/kit";

// 임시 User 타입
interface User {
  nickname: string;
  email: string;
  joinedAt: string;
  avatar?: string;
}

// 예시 데이터 (DB 연결 전이라면 목업으로 시작)
const mockUsers: User[] = [
  {
    nickname: "alice",
    email: "alice@example.com",
    joinedAt: "2025-01-01T12:00:00Z",
    avatar: "https://i.pravatar.cc/150?u=alice"
  },
  {
    nickname: "bob",
    email: "bob@example.com",
    joinedAt: "2025-02-15T09:30:00Z",
    avatar: "https://i.pravatar.cc/150?u=bob"
  }
];

export const GET: RequestHandler = async ({ params }) => {
  const { userNickName } = params;

  // DB 연동 전이니 mock 데이터에서 찾기
  const user = mockUsers.find((u) => u.nickname === userNickName);

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify(user), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};
