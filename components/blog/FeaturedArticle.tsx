"use client";

import Link from "next/link";
import { Sparkles, Clock, Calendar, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { getCategoryBySlug } from "@/lib/blog";
import { trackEvent } from "@/lib/analytics";

interface FeaturedArticleProps {
  article: BlogPost;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  const categoryObj = getCategoryBySlug(article.category);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/[0.04] p-6 sm:p-10 shadow-md">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-800 dark:text-amber-400">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Featured Guide
            </span>

            {categoryObj && (
              <Link
                href={`/blog/category/${categoryObj.slug}`}
                onClick={() =>
                  trackEvent({
                    name: "category_click",
                    category: categoryObj.slug,
                  })
                }
                className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ShieldCheck className="h-3 w-3 text-primary" />
                {categoryObj.title}
              </Link>
            )}

            <span className="font-mono text-xs text-muted-foreground flex items-center gap-1 ml-auto sm:ml-0">
              <Clock className="h-3.5 w-3.5" />
              {article.readingTime}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            <Link
              href={`/blog/${article.slug}`}
              onClick={() =>
                trackEvent({
                  name: "article_view",
                  slug: article.slug,
                  title: article.title,
                  category: article.category,
                })
              }
              className="hover:text-primary transition-colors"
            >
              {article.title}
            </Link>
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {article.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
            <Link
              href={`/blog/${article.slug}`}
              onClick={() =>
                trackEvent({
                  name: "article_view",
                  slug: article.slug,
                  title: article.title,
                  category: article.category,
                })
              }
              className="btn-primary px-5 py-2.5 text-xs font-semibold inline-flex items-center gap-2 shadow-md"
            >
              <span>Read the guide</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <span className="text-[11px] text-muted-foreground flex items-center gap-1.5 font-mono">
              <Calendar className="h-3.5 w-3.5" />
              Updated {article.updatedAt || article.publishedAt}
            </span>
          </div>
        </div>

        {/* Right side Key Takeaways Card */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <div className="lg:col-span-5 rounded-xl border border-border/80 bg-background/60 p-5 sm:p-6 space-y-3 backdrop-blur-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              Key Rebuttal Takeaways
            </h4>
            <ul className="space-y-2.5 text-xs text-muted-foreground">
              {article.keyTakeaways.slice(0, 3).map((takeaway, i) => (
                <li key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    {i + 1}
                  </span>
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
