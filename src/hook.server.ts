// src/lib/server/auth.ts
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.VITE_JWT_SECRET_KEY || "";
if (!SECRET_KEY) {
  throw new Error('JWT_SECRET_KEY 환경 변수가 설정되어야 합니다.');
}

/**
 * 토큰 유효성만 확인
 */
export function verifyToken(authHeader: string): boolean {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    jwt.verify(token, SECRET_KEY);
    return true;
  } catch {
    return false;
  }
}
