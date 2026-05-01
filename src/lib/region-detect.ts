const AFRICAN_COUNTRIES = ['NG', 'GH', 'KE', 'ZA', 'UG', 'TZ', 'RW', 'CM', 'CI', 'SN', 'ET', 'ZM', 'MW', 'BW', 'NA', 'MU', 'MA', 'EG', 'TN', 'DZ', 'AO', 'MZ', 'SD', 'LY'];
const NIGERIA = 'NG';

export function detectUserRegion(): {
  countryCode: string;
  isAfrican: boolean;
  isNigeria: boolean;
  recommendedProcessors: string[];
} {
  if (typeof window === 'undefined') {
    return { countryCode: 'US', isAfrican: false, isNigeria: false, recommendedProcessors: ['stripe', 'paypal'] };
  }

  let countryCode = 'US' as string;
  const isAfrican = AFRICAN_COUNTRIES.includes(countryCode);
  const isNigeria = countryCode === NIGERIA;

  let recommendedProcessors: string[];
  if (isNigeria) {
    recommendedProcessors = ['paystack', 'flutterwave', 'stripe', 'paypal'];
  } else if (isAfrican) {
    recommendedProcessors = ['flutterwave', 'paystack', 'stripe', 'paypal'];
  } else {
    recommendedProcessors = ['stripe', 'paypal', 'flutterwave', 'paystack'];
  }

  return { countryCode, isAfrican, isNigeria, recommendedProcessors };
}

export function getCurrencyForRegion(countryCode: string): string {
  const currencyMap: Record<string, string> = {
    NG: 'NGN', GH: 'GHS', KE: 'KES', ZA: 'ZAR',
    US: 'USD', GB: 'GBP', EU: 'EUR', CA: 'CAD',
  };
  return currencyMap[countryCode] || 'USD';
}
