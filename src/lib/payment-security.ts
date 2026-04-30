export function sanitizePaymentData(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = value.replace(/[<>]/g, '').slice(0, 1000);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export function maskCardNumber(cardNumber: string): string {
  return `****${cardNumber.slice(-4)}`;
}

export function isRateLimited(key: string): boolean {
  const attempts = parseInt(localStorage.getItem(`rate_${key}`) || '0');
  if (attempts >= 5) return true;
  localStorage.setItem(`rate_${key}`, String(attempts + 1));
  setTimeout(() => {
    const current = parseInt(localStorage.getItem(`rate_${key}`) || '0');
    if (current > 0) localStorage.setItem(`rate_${key}`, String(current - 1));
  }, 60000);
  return false;
}
