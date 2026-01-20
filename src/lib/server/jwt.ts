// src/lib/server/jwt.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET_KEY = process.env.VITE_JWT_SECRET_KEY!;
const JWT_ISSUER = process.env.JWT_ISSUER;    // optional
const JWT_AUDIENCE = process.env.JWT_AUDIENCE; // optional

type JwtPayload = {
  sub: string;
  role?: string;
  iat: number;
  exp: number;
};

export function verifyJwt(token: string): JwtPayload {
  const payload = jwt.verify(token, JWT_SECRET_KEY, {
    algorithms: ['HS256'],  // HS256 사용
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE
  });

  if (typeof payload === 'string') {
    throw new Error('Invalid JWT payload');
  }

  return payload as JwtPayload;
}
