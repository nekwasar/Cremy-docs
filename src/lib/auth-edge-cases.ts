interface AuthErrorResult {
  type: 'jwt_expired' | 'oauth_failed' | 'email_exists' | 'password_reset_failed' | 'session_expired';
  message: string;
  action: 'redirect_login' | 'retry' | 'inline_error' | 'clear_session';
  suggestions: string[];
}

export function handleJWTExpired(): AuthErrorResult {
  return {
    type: 'jwt_expired',
    message: 'Your session has expired. Please log in again to continue.',
    action: 'redirect_login',
    suggestions: ['Your session is automatically refreshed when active', 'Log in again to restore your session'],
  };
}

export function handleGoogleOAuthFailed(reason?: string): AuthErrorResult {
  return {
    type: 'oauth_failed',
    message: `Google sign-in failed. ${reason || 'Please try again or use email registration instead.'}`,
    action: 'retry',
    suggestions: [
      'Try signing in with email and password instead',
      'Check that third-party cookies are not blocked',
      'Try again in a different browser',
      'Clear your browser cache and cookies',
    ],
  };
}

export function handleEmailAlreadyExists(email: string): AuthErrorResult {
  return {
    type: 'email_exists',
    message: `An account with ${email} already exists. Please log in instead or use a different email address.`,
    action: 'inline_error',
    suggestions: [
      'Log in with this email instead',
      'Use a different email address',
      'Reset your password if you forgot it',
    ],
  };
}

export function handlePasswordResetFailed(reason: string): AuthErrorResult {
  const suggestions: Record<string, string[]> = {
    'token_expired': ['Request a new password reset link', 'Reset links are valid for 1 hour'],
    'token_used': ['Request a new password reset link', 'Each reset link can only be used once'],
    'invalid_token': ['Make sure you are using the correct reset link', 'Request a new password reset link'],
    'user_not_found': ['Check the email address you entered', 'Make sure you registered with this email'],
  };

  return {
    type: 'password_reset_failed',
    message: `Password reset failed: ${reason}.`,
    action: 'inline_error',
    suggestions: suggestions[reason] || ['Request a new password reset link', 'Contact support if the issue persists'],
  };
}

export function handleSessionExpired(): AuthErrorResult {
  return {
    type: 'session_expired',
    message: 'Your session has expired due to inactivity.',
    action: 'clear_session',
    suggestions: ['Log in again', 'Use "Remember Me" for longer sessions'],
  };
}
