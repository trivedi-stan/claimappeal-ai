"use client";

import { useState, useMemo } from "react";
import { Search, X, AlertCircle } from "lucide-react";
import { BlogPost } from "@/types/blog";
import { ArticleCard } from "./ArticleCard";
import { trackEvent } from "@/lib/analytics";

interface BlogSearchProps {
  initialArticles: BlogPost[];
  placeholder?: string;
}

export function BlogSearch({
  initialArticles,
  placeholder = "Search insurance guides, denial reasons, appeal tactics...",
}: BlogSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) {
      return initialArticles;
    }

    const query = searchQuery.toLowerCase().trim();
    const words = query.split(/\s+/).filter(Boolean);

    return initialArticles.filter((article) => {
      const inTitle = article.title.toLowerCase().includes(query);
      const inDesc = article.description.toLowerCase().includes(query);
      const inTags = article.tags.some((t) => t.toLowerCase().includes(query));
      const inCategory = article.category.toLowerCase().includes(query);
      const inContent = article.content.toLowerCase().includes(query);
      const allWords = words.every(
        (w) =>
          article.title.toLowerCase().includes(w) ||
          article.description.toLowerCase().includes(w) ||
          article.tags.some((t) => t.toLowerCase().includes(w))
      );

      return inTitle || inDesc || inTags || inCategory || inContent || allWords;
    });
  }, [searchQuery, initialArticles]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.length > 2) {
      trackEvent({
        name: "article_search",
        query: val,
        resultsCount: filteredArticles.length,
      });
    }
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      {/* Search Input Box */}
      <div className="relative max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder={placeholder}
            className="w-full rounded-xl border border-border bg-card/90 py-3 pl-11 pr-10 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground shadow-sm transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary/40"
          />
          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute right-3.5 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Search Active Indicator */}
      {searchQuery.trim() && (
        <div className="flex items-center justify-between border-b border-border pb-3 text-xs text-muted-foreground">
          <p>
            Showing <span className="font-semibold text-foreground">{filteredArticles.length}</span>{" "}
            results for &ldquo;
            <span className="font-medium text-foreground">{searchQuery}</span>&rdquo;
          </p>
          <button
            onClick={handleClear}
            className="text-primary hover:underline font-medium"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Articles Grid or Empty State */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-12 text-center space-y-3">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto" />
          <h3 className="text-sm font-semibold text-foreground">No articles matched your search</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your keywords, searching for a specific denial code (e.g. &ldquo;CO-50&rdquo;), or browse by category.
          </p>
          <button
            onClick={handleClear}
            className="btn-secondary text-xs px-4 py-1.5 mt-2"
          >
            Reset Search
          </button>
        </div>
      )}
    </div>
  );
}
