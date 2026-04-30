import { AnalyticsTrack } from '@/lib/track/analytics';

export function trackSEOPageView(page: string) {
  AnalyticsTrack.pageView(page);
}

export function trackLandingPageVisit(referrer: string) {
  AnalyticsTrack.landingPageView('/');
  if (referrer) AnalyticsTrack.referralSource(referrer);
}

export function trackFormatPageVisit(formatId: string) {
  AnalyticsTrack.formatSelected(formatId);
  AnalyticsTrack.pageView(`/format/${formatId}`);
}

export function trackConversionPageVisit(slug: string) {
  AnalyticsTrack.pageView(`/convert/${slug}`);
}

export function trackBlogPageVisit(postId: string) {
  AnalyticsTrack.pageView(`/blog/${postId}`);
}

export function trackScrollDepth(depth: number) {
  AnalyticsTrack.scrollDepth(depth);
}

export function trackTimeOnPage(page: string, seconds: number) {
  AnalyticsTrack.timeOnPage(page, seconds);
}

export function trackBounce() {
  AnalyticsTrack.bounce();
}

export function trackReturnVisit() {
  AnalyticsTrack.returnVisit();
}

export function trackSessionDuration(duration: number) {
  AnalyticsTrack.sessionDuration(duration);
}

export function trackPagesPerSession(count: number) {
  AnalyticsTrack.pagesPerSession(count);
}
