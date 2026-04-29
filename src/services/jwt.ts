import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
}

export interface JWTService {
  generateAccessToken(payload: TokenPayload): string;
  generateRefreshToken(payload: TokenPayload): string;
  verifyAccessToken(token: string): TokenPayload;
  verifyRefreshToken(token: string): TokenPayload;
  generateEmailVerificationToken(userId: string, email: string): string;
  verifyEmailVerificationToken(token: string): { userId: string; email: string };
  generatePasswordResetToken(userId: string): string;
  verifyPasswordResetToken(token: string): { userId: string };
}

function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'cremy-docs',
    jwtid: uuidv4(),
  });
}

function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET + '-refresh', {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    issuer: 'cremy-docs',
    jwtid: uuidv4(),
  });
}

function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET, {
    issuer: 'cremy-docs',
  }) as TokenPayload;
}

function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET + '-refresh', {
    issuer: 'cremy-docs',
  }) as TokenPayload;
}

function generateEmailVerificationToken(userId: string, email: string): string {
  return jwt.sign({ userId, email, type: 'email-verification' }, JWT_SECRET, {
    expiresIn: '24h',
    issuer: 'cremy-docs',
  });
}

function verifyEmailVerificationToken(token: string): { userId: string; email: string } {
  const decoded = jwt.verify(token, JWT_SECRET, {
    issuer: 'cremy-docs',
  }) as { userId: string; email: string; type: string };
  
  if (decoded.type !== 'email-verification') {
    throw new Error('Invalid token type');
  }
  
  return { userId: decoded.userId, email: decoded.email };
}

function generatePasswordResetToken(userId: string): string {
  return jwt.sign({ userId, type: 'password-reset' }, JWT_SECRET, {
    expiresIn: '1h',
    issuer: 'cremy-docs',
  });
}

function verifyPasswordResetToken(token: string): { userId: string } {
  const decoded = jwt.verify(token, JWT_SECRET, {
    issuer: 'cremy-docs',
  }) as { userId: string; type: string };
  
  if (decoded.type !== 'password-reset') {
    throw new Error('Invalid token type');
  }
  
  return { userId: decoded.userId };
}

export const jwtService: JWTService = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateEmailVerificationToken,
  verifyEmailVerificationToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
};

export default jwtService;