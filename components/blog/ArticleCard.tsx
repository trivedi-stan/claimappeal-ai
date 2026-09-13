"use client";

import Link from "next/link";
import { Clock, Calendar, ArrowRight, Shield } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { getCategoryBySlug } from "@/lib/blog";
import { trackEvent } from "@/lib/analytics";

interface ArticleCardProps {
  article: BlogPost;
  showCategory?: boolean;
}

export function ArticleCard({ article, showCategory = true }: ArticleCardProps) {
  const categoryObj = getCategoryBySlug(article.category);

  return (
    <article className="group flex flex-col justify-between rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md">
      <div className="space-y-3">
        {/* Category & Read Time */}
        <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
          {showCategory && categoryObj && (
            <Link
              href={`/blog/category/${categoryObj.slug}`}
              onClick={() =>
                trackEvent({
                  name: "category_click",
                  category: categoryObj.slug,
                })
              }
              className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-0.5 font-medium text-primary hover:bg-primary/20 transition-colors"
            >
              <Shield className="h-3 w-3" />
              <span>{categoryObj.title}</span>
            </Link>
          )}

          <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground ml-auto">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readingTime}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-bold tracking-tight text-foreground group-hover:text-primary transition-colors leading-snug">
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
          >
            {article.title}
          </Link>
        </h3>

        {/* Description Excerpt */}
        <p className="text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {article.description}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {article.publishedAt}
        </span>

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
          className="inline-flex items-center gap-1 font-semibold text-primary hover:underline text-xs group-hover:translate-x-0.5 transition-transform"
        >
          <span>Read guide</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
