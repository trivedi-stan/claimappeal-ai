import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Shield, Sparkles, BookOpen } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  getAllCategories,
  getCategoryBySlug,
  getArticlesByCategory,
} from "@/lib/blog";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { ProductCTA } from "@/components/blog/ProductCTA";
import { BreadcrumbJsonLd } from "@/components/blog/JsonLd";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const catObj = getCategoryBySlug(category);

  if (!catObj) {
    return {
      title: "Category Not Found | ClaimAppeal AI",
    };
  }

  const title = `${catObj.pillarTitle || catObj.title} | ClaimAppeal AI Resources`;
  const description =
    catObj.pillarDescription ||
    catObj.description ||
    `Educational guides, legal statutes, and clinical rebuttal strategies for ${catObj.title}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://claimappeal.ai/blog/category/${category}`,
    },
    openGraph: {
      title,
      description,
      url: `https://claimappeal.ai/blog/category/${category}`,
      type: "website",
    },
  };
}

export default async function CategoryPillarPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryObj = getCategoryBySlug(category);

  if (!categoryObj) {
    notFound();
  }

  const articles = getArticlesByCategory(category);
  const allCategories = getAllCategories();

  const breadcrumbs = [
    { name: "Home", url: "https://claimappeal.ai" },
    { name: "Blog", url: "https://claimappeal.ai/blog" },
    { name: categoryObj.title, url: `https://claimappeal.ai/blog/category/${category}` },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20">
      <BreadcrumbJsonLd items={breadcrumbs} />
      <SiteHeader />

      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-12">
          {/* Breadcrumb / Back link */}
          <div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              Back to All Articles
            </Link>
          </div>

          {/* Pillar Hero */}
          <header className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border border-primary/20 bg-primary/10 text-primary">
              <Shield className="h-3.5 w-3.5" />
              Category Pillar Hub
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
              {categoryObj.pillarTitle || categoryObj.title}
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {categoryObj.pillarDescription || categoryObj.description}
            </p>
          </header>

          {/* Category Filter Pills */}
          <div className="pt-2">
            <CategoryFilter categories={allCategories} activeCategory={category} />
          </div>

          {/* Articles Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Showing {articles.length} {articles.length === 1 ? "Guide" : "Guides"} in {categoryObj.title}
              </h2>
            </div>

            {articles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.slug}
                    article={article}
                    showCategory={false}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-3">
                <BookOpen className="h-8 w-8 text-muted-foreground mx-auto" />
                <h3 className="text-sm font-semibold text-foreground">
                  New guides for this category are in editorial review
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Our clinical research team is currently preparing statutory analysis for this topic. Check out our other popular guides.
                </p>
                <Link href="/blog" className="btn-secondary text-xs px-4 py-1.5 mt-2 inline-block">
                  Browse All Guides
                </Link>
              </div>
            )}
          </section>

          {/* Product CTA */}
          <section aria-label="Product callout" className="pt-6">
            <ProductCTA
              headline={`Have a denied claim under ${categoryObj.title}?`}
              subtext="ClaimAppeal AI automatically structures statutory appeal arguments to fight wrongful insurance denials."
              buttonText="Appeal My Claim Free"
              location={`category_pillar_${category}`}
            />
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
