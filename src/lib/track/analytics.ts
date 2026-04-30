import { getMongoDb } from '@/lib/mongodb';

let sessionId = '';

export function getSessionId(): string {
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }
  return sessionId;
}

export async function trackEvent(
  eventType: string,
  properties: Record<string, unknown> = {}
): Promise<void> {
  try {
    const db = await getMongoDb();
    await db.collection('analytics_events').insertOne({
      eventType,
      sessionId: getSessionId(),
      timestamp: new Date(),
      properties,
    });
  } catch {}
}

export const AnalyticsTrack = {
  landingPageView: (page: string) => trackEvent('landing_page_view', { page }),
  referralSource: (source: string, campaign?: string) => trackEvent('referral_source', { source, campaign }),
  deviceBrowser: (device: string, browser: string, os: string) => trackEvent('device_type', { device, browser, os }),
  signupStart: (method: string) => trackEvent('signup_start', { method }),
  signupComplete: (method: string) => trackEvent('signup_complete', { method }),
  signupAbandon: () => trackEvent('signup_abandon', {}),
  login: (provider: string) => trackEvent('login', { provider }),
  logout: () => trackEvent('logout', {}),
  deleteAccount: () => trackEvent('delete_account', {}),
  freeCreditsClaimed: (amount: number) => trackEvent('free_credits_claimed', { amount }),
  purchaseFlowStart: (packId: string) => trackEvent('purchase_flow_start', { packId }),
  purchaseComplete: (amount: number, method: string) => trackEvent('purchase_complete', { amount, method }),
  subscriptionStart: (plan: string) => trackEvent('subscription_start', { plan }),
  subscriptionUpgrade: (from: string, to: string) => trackEvent('subscription_upgrade', { from, to }),
  subscriptionCancel: (plan: string) => trackEvent('subscription_cancel', { plan }),
  subscriptionRenew: (plan: string) => trackEvent('subscription_renew', { plan }),
  creditsDeducted: (amount: number, action: string) => trackEvent('credits_deducted', { amount, action }),
  generationStart: () => trackEvent('generation_start', {}),
  generationComplete: (wordCount: number, format: string) => trackEvent('generation_complete', { wordCount, format }),
  generationFailed: (error: string) => trackEvent('generation_failed', { error }),
  documentRegenerate: () => trackEvent('document_regenerate', {}),
  editDocument: () => trackEvent('edit_document', {}),
  convertFile: (source: string, target: string) => trackEvent('convert_file', { source, target }),
  translateDocument: (source: string, target: string) => trackEvent('translate_document', { source, target }),
  voiceToDocument: () => trackEvent('voice_to_document', {}),
  extractOcr: () => trackEvent('extract_ocr', {}),
  mergeFiles: () => trackEvent('merge_files', {}),
  splitFile: () => trackEvent('split_file', {}),
  compressFile: () => trackEvent('compress_file', {}),
  changeStyle: () => trackEvent('change_style', {}),
  formatSelected: (format: string) => trackEvent('format_selected', { format }),
  templateUsed: (templateId: string, name: string) => trackEvent('template_used', { templateId, name }),
  templateFavorited: (templateId: string) => trackEvent('template_favorited', { templateId }),
  fileUpload: (format: string, size: number) => trackEvent('file_upload', { format, size }),
  fileDownload: (format: string) => trackEvent('file_download', { format }),
  fileDelete: () => trackEvent('file_delete', {}),
  pageView: (page: string) => trackEvent('page_view', { page }),
  bounce: () => trackEvent('bounce', {}),
  returnVisit: () => trackEvent('return_visit', {}),
  toolClicked: (tool: string) => trackEvent('tool_clicked', { tool }),
  toolFirstTime: (tool: string) => trackEvent('tool_used_first_time', { tool }),
  settingsOpened: () => trackEvent('settings_opened', {}),
  toneChanged: (tone: string) => trackEvent('tone_changed', { tone }),
  languageChanged: (lang: string) => trackEvent('language_changed', { lang }),
  signupToFirstGen: () => trackEvent('signup_to_first_gen', {}),
  signupToFirstConvert: () => trackEvent('signup_to_first_convert', {}),
  freeToPro: () => trackEvent('free_to_pro', {}),
  creditsLowWarning: (remaining: number) => trackEvent('credits_low_warning', { remaining }),
  errorApi: (message: string, status: number) => trackEvent('error_api', { message, status }),
  errorGeneration: (message: string) => trackEvent('error_generation', { message }),
  errorUpload: (message: string) => trackEvent('error_upload', { message }),
  errorPayment: (message: string) => trackEvent('error_payment', { message }),
  revenueTotal: (amount: number, currency: string) => trackEvent('revenue_total', { amount, currency }),
  revenueSubscription: (amount: number, plan: string) => trackEvent('revenue_subscription', { amount, plan }),
  revenueCredits: (amount: number, packId: string) => trackEvent('revenue_credits', { amount, packId }),
  averageOrderValue: (value: number) => trackEvent('average_order_value', { value }),
  ltv: (value: number) => trackEvent('ltv', { value }),
  sessionDuration: (duration: number) => trackEvent('session_duration', { duration }),
  pagesPerSession: (count: number) => trackEvent('pages_per_session', { count }),
  scrollDepth: (depth: number) => trackEvent('scroll_depth', { depth }),
  timeOnPage: (page: string, seconds: number) => trackEvent('time_on_page', { page, seconds }),
};
