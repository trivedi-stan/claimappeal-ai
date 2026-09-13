import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSeoArticle, getArticlesByCategory } from "@/lib/seo-engine";
import { SeoArticleTemplate } from "@/components/seo/SeoArticleTemplate";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const articles = getArticlesByCategory("insurance-types");
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getSeoArticle("insurance-types", slug);
  if (!article) return {};

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://claimappeal-ai.vercel.app";

  return {
    title: `${article.metaTitle} | ClaimAppeal AI`,
    description: article.metaDescription,
    alternates: {
      canonical: `${baseUrl}${article.canonicalPath}`,
    },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: `${baseUrl}${article.canonicalPath}`,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle,
      description: article.metaDescription,
    },
  };
}

export default async function InsuranceTypeArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getSeoArticle("insurance-types", slug);

  if (!article) {
    notFound();
  }

  return <SeoArticleTemplate article={article} />;
}
