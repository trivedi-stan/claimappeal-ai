import { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/blog";
import { BLOG_CATEGORIES } from "@/data/blog/categories";
import { getAllSeoArticles } from "@/lib/seo-engine";
import { SEO_CATEGORIES } from "@/data/seo-content/intent-database";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://claimappeal-ai.vercel.app";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Old Blog Category routes
  const blogCategoryRoutes: MetadataRoute.Sitemap = BLOG_CATEGORIES.map((category) => ({
    url: `${baseUrl}/blog/category/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Old Blog Article routes
  const blogArticles = getAllArticles();
  const blogArticleRoutes: MetadataRoute.Sitemap = blogArticles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.publishedAt),
    changeFrequency: "monthly",
    priority: article.isFeatured ? 0.9 : article.isPopular ? 0.85 : 0.8,
  }));

  // New SEO Category Hub routes (7 hubs)
  const seoCategoryHubs: MetadataRoute.Sitemap = SEO_CATEGORIES.map((cat) => ({
    url: `${baseUrl}${cat.pathPrefix}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // New SEO Multi-Category Article routes (45 articles)
  const seoArticles = getAllSeoArticles();
  const seoArticleRoutes: MetadataRoute.Sitemap = seoArticles.map((article) => ({
    url: `${baseUrl}${article.canonicalPath}`,
    lastModified: new Date(article.updatedAt || article.publishedAt),
    changeFrequency: "weekly",
    priority:
      article.searchIntent === "generate"
        ? 0.95
        : article.searchIntent === "template"
        ? 0.9
        : 0.85,
  }));

  return [
    ...staticRoutes,
    ...blogCategoryRoutes,
    ...blogArticleRoutes,
    ...seoCategoryHubs,
    ...seoArticleRoutes,
  ];
}
