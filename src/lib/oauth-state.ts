import crypto from 'crypto';

const OAUTH_STATE_SECRET = process.env.OAUTH_STATE_SECRET || 'oauth-state-secret-change-me';

interface OAuthState {
  uid: string;
  nonce: string;
  exp: number;
  redir: string;
}

export function generateOAuthState(userId: string, redirectUrl: string = '/dashboard'): string {
  const state: OAuthState = {
    uid: userId,
    nonce: crypto.randomBytes(32).toString('hex'),
    exp: Date.now() + 600000, // 10 minute expiry
    redir: redirectUrl,
  };

  const encrypted = encryptState(JSON.stringify(state));
  return encrypted;
}

export function verifyOAuthState(encryptedState: string): OAuthState | null {
  try {
    const decrypted = decryptState(encryptedState);
    const state: OAuthState = JSON.parse(decrypted);

    if (state.exp < Date.now()) {
      return null;
    }

    return state;
  } catch {
    return null;
  }
}

function encryptState(data: string): string {
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(OAUTH_STATE_SECRET, 'salt', 32);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return `${iv.toString('hex')}:${encrypted}`;
}

function decryptState(encryptedData: string): string {
  const [ivHex, encrypted] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const key = crypto.scryptSync(OAUTH_STATE_SECRET, 'salt', 32);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// Google OAuth scope
export const GOOGLE_OAUTH_SCOPE = [
  'openid',
  'email',
  'profile',
].join(' ');

// OAuth configuration
export const getGoogleOAuthConfig = (baseUrl: string) => ({
  client_id: process.env.GOOGLE_CLIENT_ID,
  redirect_uri: `${baseUrl}/api/auth/google/callback`,
  response_type: 'code',
  scope: GOOGLE_OAUTH_SCOPE,
  access_type: 'offline',
  prompt: 'consent',
});
