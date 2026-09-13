/**
 * Safe, credential-free analytics event dispatcher for ClaimAppeal AI.
 * Emits browser custom events, logs in development, and delegates to
 * window.dataLayer or any configured privacy-friendly analytics endpoint.
 */

export type AnalyticsEvent =
  | { name: "blog_page_view"; path: string }
  | { name: "article_view"; slug: string; title: string; category: string }
  | { name: "article_search"; query: string; resultsCount: number }
  | { name: "category_click"; category: string }
  | { name: "related_article_click"; fromSlug: string; toSlug: string }
  | { name: "cta_click"; location: string; ctaText: string; destination: string }
  | { name: "denial_code_selected"; code: string; category: string }
  | { name: "denial_code_cta_click"; code: string }
  | { name: "search_intent_query"; query: string }
  | { name: "sample_letter_copied"; article_slug: string; category: string }
  | { name: "seo_cta_clicked"; slug: string; category: string; intent?: string }
  | { name: "newsletter_signup"; source: string; emailHashed?: string }
  | { name: string; [key: string]: unknown };

export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;

  // 1. Dispatch custom DOM event for lightweight client decoupling
  try {
    const customEvent = new CustomEvent("claimappeal_analytics", {
      detail: {
        ...event,
        timestamp: new Date().toISOString(),
      },
    });
    window.dispatchEvent(customEvent);
  } catch {
    // Silently ignore older browser environments
  }

  // 2. Safely support Google Tag Manager / window.dataLayer if present
  if ((window as any).dataLayer && Array.isArray((window as any).dataLayer)) {
    (window as any).dataLayer.push({
      event: event.name,
      ...event,
    });
  }

  // 3. Optional debug logging in development mode
  if (process.env.NODE_ENV === "development") {
    // console.debug("[Analytics Event]:", event);
  }
}
