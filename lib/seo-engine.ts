import { SEO_ARTICLES } from "@/data/seo-content/articles-repository";
import { SEO_CATEGORIES, getCategoryMeta } from "@/data/seo-content/intent-database";
import { SeoArticle, SeoCategory, SearchIntentType, InsuranceType } from "@/types/seo-content";

export function getAllSeoArticles(): SeoArticle[] {
  return [...SEO_ARTICLES].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getSeoArticle(category: SeoCategory, slug: string): SeoArticle | undefined {
  return SEO_ARTICLES.find((a) => a.category === category && a.slug === slug);
}

export function getArticlesByCategory(category: SeoCategory): SeoArticle[] {
  return SEO_ARTICLES.filter((a) => a.category === category);
}

export function getArticlesByIntent(intent: SearchIntentType): SeoArticle[] {
  return SEO_ARTICLES.filter((a) => a.searchIntent === intent);
}

export function getArticlesByInsuranceType(insuranceType: InsuranceType): SeoArticle[] {
  return SEO_ARTICLES.filter((a) => a.insuranceType === insuranceType);
}

export function getArticlesByDenialCode(denialCode: string): SeoArticle[] {
  return SEO_ARTICLES.filter((a) => a.denialCode?.toLowerCase() === denialCode.toLowerCase());
}

/**
 * Smart Cross-Intent Internal Linking Algorithm
 * Connects Understand -> Action -> Template -> Generate
 */
export function getRelatedSeoArticles(currentArticle: SeoArticle, limit = 4): SeoArticle[] {
  const allExceptCurrent = SEO_ARTICLES.filter((a) => a.id !== currentArticle.id);

  // 1. Explicitly defined related slugs
  const explicit: SeoArticle[] = (currentArticle.relatedSlugs || [])
    .map((slug) => SEO_ARTICLES.find((a) => a.slug === slug))
    .filter((a): a is SeoArticle => a !== undefined && a.id !== currentArticle.id);

  if (explicit.length >= limit) {
    return explicit.slice(0, limit);
  }

  // 2. Same denial code (highest priority for clinical matching)
  const sameDenial = currentArticle.denialCode
    ? allExceptCurrent.filter(
        (a) =>
          a.denialCode === currentArticle.denialCode &&
          !explicit.some((e) => e.id === a.id)
      )
    : [];

  // 3. Complementary intent progression
  // understand -> action & template
  // action -> template & generate
  // template -> generate & action
  const complementaryIntentMap: Record<SearchIntentType, SearchIntentType[]> = {
    understand: ["action", "template", "generate"],
    action: ["template", "generate", "understand"],
    template: ["generate", "action", "document"],
    generate: ["template", "action", "denial_reason"],
    denial_reason: ["action", "template", "generate"],
    document: ["action", "template", "understand"],
  };

  const targetIntents = complementaryIntentMap[currentArticle.searchIntent] || [];
  const complementary = allExceptCurrent.filter(
    (a) =>
      targetIntents.includes(a.searchIntent) &&
      !explicit.some((e) => e.id === a.id) &&
      !sameDenial.some((s) => s.id === a.id) &&
      (a.insuranceType === currentArticle.insuranceType || a.insuranceType === "health" || a.insuranceType === "general")
  );

  // 4. Same Category Fallback
  const sameCategory = allExceptCurrent.filter(
    (a) =>
      a.category === currentArticle.category &&
      !explicit.some((e) => e.id === a.id) &&
      !sameDenial.some((s) => s.id === a.id) &&
      !complementary.some((c) => c.id === a.id)
  );

  return [...explicit, ...sameDenial, ...complementary, ...sameCategory].slice(0, limit);
}

/**
 * Natural Language Search & Search Intent Ranker
 * Allows users to search natural queries like "my claim was denied because of prior authorization"
 */
export function searchSeoArticles(query: string): SeoArticle[] {
  if (!query || !query.trim()) return getAllSeoArticles();

  const terms = query
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);

  if (terms.length === 0) return getAllSeoArticles();

  const scored = SEO_ARTICLES.map((article) => {
    let score = 0;
    const lowerTitle = article.title.toLowerCase();
    const lowerH1 = article.h1.toLowerCase();
    const lowerPrimaryKw = article.primaryKeyword.toLowerCase();
    const lowerExcerpt = article.excerpt.toLowerCase();
    const lowerDenialCode = (article.denialCode || "").toLowerCase();
    const lowerDenialName = (article.denialReasonName || "").toLowerCase();
    const lowerInsurance = article.insuranceType.toLowerCase();

    // Exact full query match in title or primary keyword
    const lowerQuery = query.toLowerCase().trim();
    if (lowerTitle.includes(lowerQuery) || lowerPrimaryKw.includes(lowerQuery)) {
      score += 50;
    }

    terms.forEach((term) => {
      // Primary keyword match
      if (lowerPrimaryKw.includes(term)) score += 15;
      // Title match
      if (lowerTitle.includes(term) || lowerH1.includes(term)) score += 10;
      // Denial code match (e.g. "50", "co-50", "197")
      if (lowerDenialCode.includes(term) && term.length >= 2) score += 20;
      // Denial reason name match (e.g. "necessity", "authorization")
      if (lowerDenialName.includes(term)) score += 12;
      // Insurance type match (e.g. "dental", "vision", "prescription")
      if (lowerInsurance.includes(term)) score += 8;
      // Excerpt / content match
      if (lowerExcerpt.includes(term)) score += 3;
      // Secondary keywords match
      if (article.secondaryKeywords.some((sk) => sk.toLowerCase().includes(term))) {
        score += 6;
      }
    });

    return { article, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.article);
}

export { SEO_CATEGORIES, getCategoryMeta };
