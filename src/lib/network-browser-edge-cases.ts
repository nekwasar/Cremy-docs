interface NetworkErrorResult {
  type: 'offline' | 'slow_connection' | 'reconnecting';
  message: string;
  canContinue: boolean;
  mode: 'offline' | 'degraded' | 'normal';
  suggestions: string[];
}

let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
let connectionType: string = 'unknown';
let reconnectAttempts = 0;

export function initNetworkMonitoring(): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleOnline = () => {
    isOnline = true;
    reconnectAttempts = 0;
  };

  const handleOffline = () => {
    isOnline = false;
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

export function checkNetworkStatus(): NetworkErrorResult {
  if (!isOnline) {
    return {
      type: 'offline',
      message: 'No internet connection. Some features are unavailable. Your work is saved locally and will sync when you reconnect.',
      canContinue: true,
      mode: 'offline',
      suggestions: [
        'Check your internet connection',
        'You can still view and edit saved documents',
        'Generation and conversion require an internet connection',
        'Your work will automatically sync when you reconnect',
      ],
    };
  }

  const conn = (navigator as any).connection;
  if (conn) {
    connectionType = conn.effectiveType || 'unknown';

    if (connectionType === 'slow-2g' || connectionType === '2g') {
      return {
        type: 'slow_connection',
        message: 'Your internet connection is slow. Document generation may take longer than usual.',
        canContinue: true,
        mode: 'degraded',
        suggestions: [
          'AI generation will still work but may be slower',
          'Try smaller documents for faster results',
          'Switch to Wi-Fi for better performance',
          'Your work will not be lost during slow connections',
        ],
      };
    }
  }

  return {
    type: 'reconnecting',
    message: '',
    canContinue: true,
    mode: 'normal',
    suggestions: [],
  };
}

export function incrementReconnectAttempts(): {
  shouldRetry: boolean;
  attempt: number;
  nextDelay: number;
} {
  reconnectAttempts++;
  const maxRetries = 5;
  const shouldRetry = reconnectAttempts <= maxRetries;
  const nextDelay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);

  return { shouldRetry, attempt: reconnectAttempts, nextDelay };
}

export function handleUnsupportedBrowser(): {
  isSupported: boolean;
  message: string;
  missing: string[];
} {
  if (typeof window === 'undefined') return { isSupported: true, message: '', missing: [] };

  const missing: string[] = [];

  if (!window.FileReader) missing.push('FileReader API');
  if (!window.Blob) missing.push('Blob API');
  if (!navigator.mediaDevices?.getUserMedia) missing.push('Microphone access');
  if (!window.localStorage) missing.push('Local Storage');
  if (typeof fetch === 'undefined') missing.push('Fetch API');

  if (missing.length > 0) {
    return {
      isSupported: false,
      message: `Your browser is missing required features: ${missing.join(', ')}. Please upgrade to a modern browser.`,
      missing,
    };
  }

  const userAgent = navigator.userAgent;
  const isOldIE = /MSIE|Trident/.test(userAgent);
  const isOldSafari = /Version\/[0-9]/.test(userAgent) && !/Chrome/.test(userAgent);

  if (isOldIE) {
    return {
      isSupported: false,
      message: 'Internet Explorer is not supported. Please use Chrome, Firefox, Safari, or Edge.',
      missing: ['Modern browser engine'],
    };
  }

  return { isSupported: true, message: '', missing: [] };
}

export function getConnectionQuality(): 'excellent' | 'good' | 'poor' | 'offline' {
  if (!isOnline) return 'offline';

  const conn = (navigator as any).connection;
  if (!conn) return 'good';

  switch (conn.effectiveType) {
    case '4g': return 'excellent';
    case '3g': return 'good';
    case '2g':
    case 'slow-2g': return 'poor';
    default: return 'good';
  }
}
