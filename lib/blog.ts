import { BLOG_ARTICLES } from "@/data/blog/articles";
import { BLOG_CATEGORIES, getCategoryBySlug } from "@/data/blog/categories";
import { BlogPost, BlogCategory } from "@/types/blog";

export function getAllArticles(): BlogPost[] {
  // Return articles sorted by publishedAt descending
  return [...BLOG_ARTICLES].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getArticleBySlug(slug: string): BlogPost | undefined {
  return BLOG_ARTICLES.find((article) => article.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): BlogPost[] {
  return getAllArticles().filter((article) => article.category === categorySlug);
}

export function getFeaturedArticle(): BlogPost {
  const featured = BLOG_ARTICLES.find((article) => article.isFeatured);
  return featured || BLOG_ARTICLES[1] || BLOG_ARTICLES[0];
}

export function getPopularArticles(): BlogPost[] {
  return getAllArticles().filter((article) => article.isPopular).slice(0, 6);
}

export function getRelatedArticles(currentSlug: string, limit = 3): BlogPost[] {
  const current = getArticleBySlug(currentSlug);
  if (!current) return getAllArticles().slice(0, limit);

  // First pick explicitly defined related slugs
  const explicitRelated = (current.relatedSlugs || [])
    .map((slug) => getArticleBySlug(slug))
    .filter((a): a is BlogPost => a !== undefined && a.slug !== currentSlug);

  if (explicitRelated.length >= limit) {
    return explicitRelated.slice(0, limit);
  }

  // Next, pick articles from the same category
  const sameCategory = getAllArticles().filter(
    (a) =>
      a.category === current.category &&
      a.slug !== currentSlug &&
      !explicitRelated.some((er) => er.slug === a.slug)
  );

  const combined = [...explicitRelated, ...sameCategory];
  if (combined.length >= limit) {
    return combined.slice(0, limit);
  }

  // Fallback to remaining latest articles
  const remaining = getAllArticles().filter(
    (a) => a.slug !== currentSlug && !combined.some((c) => c.slug === a.slug)
  );

  return [...combined, ...remaining].slice(0, limit);
}

export function searchArticles(query: string): BlogPost[] {
  if (!query || query.trim() === "") {
    return getAllArticles();
  }

  const normalized = query.toLowerCase().trim();
  const words = normalized.split(/\s+/).filter(Boolean);

  return getAllArticles().filter((article) => {
    const titleMatch = article.title.toLowerCase().includes(normalized);
    const descMatch = article.description.toLowerCase().includes(normalized);
    const categoryObj = getCategoryBySlug(article.category);
    const categoryMatch =
      categoryObj?.title.toLowerCase().includes(normalized) ||
      article.category.toLowerCase().includes(normalized);
    const tagsMatch = article.tags.some((tag) => tag.toLowerCase().includes(normalized));
    const contentMatch = article.content.toLowerCase().includes(normalized);

    // Multi-word search score
    const allWordsInTitleOrDesc = words.every(
      (w) =>
        article.title.toLowerCase().includes(w) ||
        article.description.toLowerCase().includes(w) ||
        article.tags.some((t) => t.toLowerCase().includes(w))
    );

    return titleMatch || descMatch || tagsMatch || categoryMatch || allWordsInTitleOrDesc || contentMatch;
  });
}

export function getAllCategories(): BlogCategory[] {
  return BLOG_CATEGORIES;
}

export { getCategoryBySlug };
