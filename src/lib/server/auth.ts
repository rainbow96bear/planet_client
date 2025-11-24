// src/lib/server/auth.ts

interface UserPayload {
  id: string;
  nickname: string;
  email?: string;
}

// 예시: JWT 검증
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY ?? 'secret';

export async function verifyToken(authHeader: string): Promise<UserPayload> {
  if (!authHeader.startsWith('Bearer ')) {
    throw new Error('Invalid token format');
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, SECRET_KEY) as UserPayload;
    return payload;
  } catch (err) {
    throw new Error('Invalid token');
  }
}
