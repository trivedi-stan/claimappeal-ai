"use client";

import Link from "next/link";
import { BlogCategory } from "@/types/blog";
import { trackEvent } from "@/lib/analytics";

interface CategoryFilterProps {
  categories: BlogCategory[];
  activeCategory?: string; // slug or undefined for 'All'
}

export function CategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
      {/* "All" button */}
      <Link
        href="/blog"
        onClick={() => trackEvent({ name: "category_click", category: "all" })}
        className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
          !activeCategory
            ? "bg-primary text-primary-foreground shadow-sm font-semibold"
            : "border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
        }`}
      >
        All Articles
      </Link>

      {categories.map((cat) => {
        const isActive = activeCategory === cat.slug;
        return (
          <Link
            key={cat.slug}
            href={`/blog/category/${cat.slug}`}
            onClick={() => trackEvent({ name: "category_click", category: cat.slug })}
            className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                : "border border-border bg-card hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.title}
          </Link>
        );
      })}
    </div>
  );
}
