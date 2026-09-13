import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Share2,
  BookOpen,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  getAllArticles,
  getArticleBySlug,
  getCategoryBySlug,
  getRelatedArticles,
} from "@/lib/blog";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { ArticleFAQ } from "@/components/blog/ArticleFAQ";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { ProductCTA } from "@/components/blog/ProductCTA";
import { ArticleCard } from "@/components/blog/ArticleCard";
import {
  ArticleJsonLd,
  FAQJsonLd,
  BreadcrumbJsonLd,
} from "@/components/blog/JsonLd";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found | ClaimAppeal AI",
    };
  }

  const categoryObj = getCategoryBySlug(article.category);
  const url = `https://claimappeal.ai/blog/${slug}`;

  return {
    title: `${article.title} | ClaimAppeal AI`,
    description: article.description,
    keywords: article.tags,
    authors: [{ name: article.author.name }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${article.title} | ClaimAppeal AI`,
      description: article.description,
      url,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      section: categoryObj?.title || "Health Insurance Appeals",
      tags: article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const categoryObj = getCategoryBySlug(article.category);
  const relatedArticles = getRelatedArticles(slug, 3);
  const url = `https://claimappeal.ai/blog/${slug}`;

  const breadcrumbs = [
    { name: "Home", url: "https://claimappeal.ai" },
    { name: "Blog", url: "https://claimappeal.ai/blog" },
    {
      name: categoryObj?.title || "Resources",
      url: `https://claimappeal.ai/blog/category/${article.category}`,
    },
    { name: article.title, url },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20">
      {/* Structured Data */}
      <ArticleJsonLd article={article} url={url} />
      {article.faq && <FAQJsonLd faq={article.faq} />}
      <BreadcrumbJsonLd items={breadcrumbs} />

      <SiteHeader />

      <main className="flex-1 py-10 md:py-14">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/blog" className="hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              {categoryObj && (
                <>
                  <li>/</li>
                  <li>
                    <Link
                      href={`/blog/category/${categoryObj.slug}`}
                      className="hover:text-foreground transition-colors"
                    >
                      {categoryObj.title}
                    </Link>
                  </li>
                </>
              )}
            </ol>
          </nav>

          {/* Article Header Header */}
          <header className="max-w-4xl space-y-4 pb-8 border-b border-border">
            {categoryObj && (
              <Link
                href={`/blog/category/${categoryObj.slug}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
              >
                <Shield className="h-3.5 w-3.5" />
                {categoryObj.title}
              </Link>
            )}

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              {article.title}
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {article.description}
            </p>

            {/* Author & Meta Row */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-xs leading-none">
                      {article.author.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {article.author.role}
                    </p>
                  </div>
                </div>

                <span className="hidden sm:inline text-muted-foreground">•</span>

                <div className="flex items-center gap-1 font-mono text-[11px]">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Published {article.publishedAt}</span>
                  {article.updatedAt && (
                    <span className="text-muted-foreground/80">
                      (Updated {article.updatedAt})
                    </span>
                  )}
                </div>

                <span className="hidden sm:inline text-muted-foreground">•</span>

                <div className="flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{article.readingTime}</span>
                </div>
              </div>

              {/* Social Share Buttons */}
              <ShareButtons title={article.title} slug={article.slug} />
            </div>
          </header>

          {/* Key Takeaways Callout Box */}
          {article.keyTakeaways && article.keyTakeaways.length > 0 && (
            <div className="my-8 rounded-xl border border-border bg-card p-5 sm:p-6 space-y-3 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Key Rebuttal Takeaways
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                {article.keyTakeaways.map((takeaway, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed">
                    <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary mt-0.5">
                      {i + 1}
                    </span>
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Statutory Legal Alert Box */}
          {article.statutoryAlert && (
            <div className="my-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 sm:p-6 text-amber-950 dark:text-amber-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs sm:text-sm leading-relaxed">
                  <p className="font-semibold text-amber-900 dark:text-amber-300">
                    {article.statutoryAlert.title}
                  </p>
                  <p>{article.statutoryAlert.description}</p>
                  {article.statutoryAlert.citation && (
                    <p className="font-mono text-[11px] text-amber-700 dark:text-amber-400 font-semibold pt-1">
                      Statutory Citation: {article.statutoryAlert.citation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Content Layout Grid (Sidebar Table of Contents + Main Body) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start my-8">
            {/* Left Sidebar Table of Contents (Sticky on desktop) */}
            <aside className="lg:col-span-4 order-2 lg:order-1">
              <TableOfContents items={article.tableOfContents} />

              {/* Sidebar Mini CTA */}
              <div className="hidden lg:block mt-6 rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2.5">
                <h4 className="text-xs font-bold text-foreground">
                  Need Help With Your Appeal?
                </h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Upload your denial letter and let ClaimAppeal AI structure statutory citations in minutes.
                </p>
                <Link
                  href="/appeals/new"
                  className="btn-primary w-full py-2 text-xs font-semibold inline-flex items-center justify-center gap-1.5"
                >
                  <span>Start Free Draft</span>
                </Link>
              </div>
            </aside>

            {/* Main Content Article Body */}
            <article className="lg:col-span-8 order-1 lg:order-2 space-y-6">
              {/* Mobile Table of Contents */}
              <div className="block lg:hidden">
                <TableOfContents items={article.tableOfContents} />
              </div>

              {/* Rendered Semantic Content */}
              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed text-xs sm:text-sm space-y-6">
                {/* Parse Markdown-like sections into semantic elements */}
                {article.content.split("\n\n").map((paragraph, index) => {
                  const trimmed = paragraph.trim();
                  if (!trimmed) return null;

                  // H2 headings
                  if (trimmed.startsWith("## ")) {
                    const headingText = trimmed.replace("## ", "").trim();
                    // Match id with TOC
                    const tocMatch = article.tableOfContents.find(
                      (t) => t.title.toLowerCase() === headingText.toLowerCase()
                    );
                    const id = tocMatch ? tocMatch.id : `section-${index}`;
                    return (
                      <h2
                        key={index}
                        id={id}
                        className="text-lg sm:text-xl font-bold text-foreground pt-6 border-t border-border/60 first:border-0 first:pt-0 scroll-mt-24"
                      >
                        {headingText}
                      </h2>
                    );
                  }

                  // H3 headings
                  if (trimmed.startsWith("### ")) {
                    const headingText = trimmed.replace("### ", "").trim();
                    return (
                      <h3
                        key={index}
                        className="text-sm sm:text-base font-bold text-foreground pt-2 scroll-mt-24"
                      >
                        {headingText}
                      </h3>
                    );
                  }

                  // Bullet lists
                  if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                    const items = trimmed.split("\n").filter((l) => l.trim());
                    return (
                      <ul key={index} className="list-disc pl-5 space-y-1.5">
                        {items.map((it, i) => (
                          <li key={i}>
                            {it.replace(/^[-*]\s+/, "")}
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  // Numbered lists
                  if (/^\d+\.\s/.test(trimmed)) {
                    const items = trimmed.split("\n").filter((l) => l.trim());
                    return (
                      <ol key={index} className="list-decimal pl-5 space-y-1.5">
                        {items.map((it, i) => (
                          <li key={i}>
                            {it.replace(/^\d+\.\s+/, "")}
                          </li>
                        ))}
                      </ol>
                    );
                  }

                  // Tables
                  if (trimmed.includes("|") && trimmed.includes("\n|")) {
                    const rows = trimmed
                      .split("\n")
                      .filter((r) => r.trim().startsWith("|") && !r.includes("---"));
                    if (rows.length > 0) {
                      const headerCells = rows[0]
                        .split("|")
                        .map((c) => c.trim())
                        .filter(Boolean);
                      const bodyRows = rows.slice(1);
                      return (
                        <div key={index} className="overflow-x-auto my-4 rounded-lg border border-border">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead className="bg-muted/60 text-foreground border-b border-border">
                              <tr>
                                {headerCells.map((h, hi) => (
                                  <th key={hi} className="p-3 font-semibold">
                                    {h.replace(/\*\*/g, "")}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {bodyRows.map((r, ri) => {
                                const cells = r
                                  .split("|")
                                  .map((c) => c.trim())
                                  .filter(Boolean);
                                return (
                                  <tr key={ri} className="hover:bg-muted/30">
                                    {cells.map((c, ci) => (
                                      <td key={ci} className="p-3">
                                        {c.replace(/\*\*/g, "")}
                                      </td>
                                    ))}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    }
                  }

                  // Standard paragraphs with basic bold support
                  return (
                    <p key={index} className="leading-relaxed">
                      {trimmed}
                    </p>
                  );
                })}
              </div>

              {/* Mid-Article Callout / Product Banner */}
              <div className="my-8">
                <ProductCTA
                  headline="Want help preparing your appeal?"
                  subtext="Upload your denial letter and let ClaimAppeal AI help you construct an evidentiary rebuttal grounded in federal regulations."
                  buttonText="Generate My Appeal"
                  location={`article_mid_${article.slug}`}
                />
              </div>

              {/* Article FAQ Accordion */}
              {article.faq && article.faq.length > 0 && (
                <ArticleFAQ faq={article.faq} />
              )}

              {/* Social Sharing Footer */}
              <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Tags:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[11px] font-mono text-muted-foreground"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <ShareButtons title={article.title} slug={article.slug} />
              </div>

              {/* Mandatory Subtle Medical & Legal Disclaimer */}
              <div className="rounded-xl border border-border bg-muted/20 p-4 text-[11px] leading-relaxed text-muted-foreground">
                <p>
                  <strong>Disclaimer:</strong> Content on ClaimAppeal AI is provided for general educational purposes and is not a substitute for professional medical, legal, or insurance advice. Always review your insurer&apos;s official instructions, Summary Plan Description, and policy documents.
                </p>
              </div>
            </article>
          </div>

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <section className="pt-12 border-t border-border space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Related Guides &amp; Resources
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Further reading to strengthen your medical denial appeal strategy.
                  </p>
                </div>

                <Link
                  href="/blog"
                  className="text-xs font-semibold text-primary hover:underline hidden sm:inline"
                >
                  Browse all guides →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((rel) => (
                  <ArticleCard key={rel.slug} article={rel} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
