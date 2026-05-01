import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getRedis } from './redis';

const REFRESH_SECRET = process.env.REFRESH_SECRET || process.env.JWT_SECRET + '-refresh';
const ACCESS_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

export interface TokenPayload {
  sub: string;
  email: string;
  role: string;
  isEmailVerified: boolean;
}

export interface RefreshTokenData {
  jti: string;
  uid: string;
  sub: string;
  exp: number;
  iat: number;
  rot: number;
  revoked: boolean;
  replacedBy: string | null;
  family: string;
}

export async function generateAccessToken(payload: TokenPayload): Promise<string> {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: '15m',
    issuer: 'cremy-docs',
  });
}

export async function generateRefreshToken(
  uid: string,
  email: string,
  family?: string
): Promise<{ token: string; jti: string }> {
  const jti = uuidv4();
  const tokenFamily = family || jti;
  
  const refreshToken: RefreshTokenData = {
    jti,
    uid,
    sub: email,
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000),
    iat: Date.now(),
    rot: 0,
    revoked: false,
    replacedBy: null,
    family: tokenFamily,
  };

  const token = jwt.sign(
    {
      jti: refreshToken.jti,
      uid: refreshToken.uid,
      sub: refreshToken.sub,
      family: refreshToken.family,
    },
    REFRESH_SECRET,
    {
      expiresIn: '7d',
      issuer: 'cremy-docs',
    }
  );

  const redis = getRedis();
  await redis.setex(
    `refresh:${jti}`,
    7 * 24 * 60 * 60,
    JSON.stringify(refreshToken)
  );

  return { token, jti };
}

export async function verifyAccessToken(token: string): Promise<TokenPayload> {
  return jwt.verify(token, ACCESS_SECRET, {
    issuer: 'cremy-docs',
  }) as TokenPayload;
}

export async function verifyRefreshToken(
  token: string
): Promise<RefreshTokenData | null> {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET, {
      issuer: 'cremy-docs',
    }) as { jti: string; uid: string; sub: string; family: string };

    const redis = getRedis();
    const tokenData = await redis.get(`refresh:${decoded.jti}`);

    if (!tokenData) return null;

    const refreshToken: RefreshTokenData = JSON.parse(tokenData);

    if (refreshToken.revoked) return null;

    return refreshToken;
  } catch {
    return null;
  }
}

export async function rotateRefreshToken(
  oldToken: string
): Promise<{ accessToken: string; refreshToken: string } | null> {
  const decoded = jwt.verify(oldToken, REFRESH_SECRET, {
    issuer: 'cremy-docs',
  }) as { jti: string; uid: string; sub: string; family: string };

  const redis = getRedis();
  
  const isRevoked = await redis.get(`revoked:${decoded.jti}`);
  if (isRevoked) {
    throw new Error('Token revoked');
  }

  await redis.setex(`revoked:${decoded.jti}`, 86400, '1');

  const newJti = uuidv4();
  const newFamily = decoded.family || decoded.jti;

  const newToken = jwt.sign(
    {
      jti: newJti,
      uid: decoded.uid,
      sub: decoded.sub,
      family: newFamily,
    },
    REFRESH_SECRET,
    { expiresIn: '7d', issuer: 'cremy-docs' }
  );

  const newRefreshData: RefreshTokenData = {
    jti: newJti,
    uid: decoded.uid,
    sub: decoded.sub,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
    iat: Date.now(),
    rot: 0,
    revoked: false,
    replacedBy: null,
    family: newFamily,
  };

  await redis.setex(`refresh:${newJti}`, 7 * 24 * 60 * 60, JSON.stringify(newRefreshData));

  const accessToken = await generateAccessToken({
    sub: decoded.sub,
    email: decoded.email || '',
    role: 'user',
    isEmailVerified: true,
  });

  return { accessToken, refreshToken: newToken };
}

export async function revokeToken(jti: string): Promise<void> {
  const redis = getRedis();
  
  const tokenData = await redis.get(`refresh:${jti}`);
  if (tokenData) {
    const token: RefreshTokenData = JSON.parse(tokenData);
    token.revoked = true;
    await redis.setex(`refresh:${jti}`, 86400, JSON.stringify(token));
  }

  await redis.setex(`revoked:${jti}`, 86400, '1');
}

export async function revokeAllUserTokens(uid: string): Promise<void> {
  const redis = getRedis();
  const keys = await redis.keys(`refresh:*:${uid}:*`);
  
  for (const key of keys) {
    const tokenData = await redis.get(key);
    if (tokenData) {
      const token: RefreshTokenData = JSON.parse(tokenData);
      token.revoked = true;
      await redis.setex(`refresh:${token.jti}`, 86400, JSON.stringify(token));
      await redis.setex(`revoked:${token.jti}`, 86400, '1');
    }
  }
}

export async function checkTokenRevoked(jti: string): Promise<boolean> {
  const redis = getRedis();
  const isRevoked = await redis.get(`revoked:${jti}`);
  return isRevoked === '1';
}
