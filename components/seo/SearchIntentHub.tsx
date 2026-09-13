"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  ArrowRight,
  Shield,
  Clock,
  Filter,
  Sparkles,
  FileText,
  BookOpen,
  ShieldAlert,
  Layers,
  HelpCircle,
  Copy,
  FileCheck2,
  X,
} from "lucide-react";
import { SeoArticle, SeoCategory, InsuranceType } from "@/types/seo-content";
import { getAllSeoArticles, searchSeoArticles, SEO_CATEGORIES, getCategoryMeta } from "@/lib/seo-engine";
import { trackEvent } from "@/lib/analytics";

interface SearchIntentHubProps {
  initialArticles?: SeoArticle[];
}

export function SearchIntentHub({ initialArticles }: SearchIntentHubProps) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedInsurance, setSelectedInsurance] = useState<string>("all");

  const allArticles = useMemo(() => initialArticles || getAllSeoArticles(), [initialArticles]);

  const searchResults = useMemo(() => {
    let list = query.trim() ? searchSeoArticles(query) : allArticles;

    if (selectedCategory !== "all") {
      list = list.filter((a) => a.category === selectedCategory);
    }

    if (selectedInsurance !== "all") {
      list = list.filter((a) => a.insuranceType === selectedInsurance);
    }

    return list;
  }, [query, selectedCategory, selectedInsurance, allArticles]);

  const clearFilters = () => {
    setQuery("");
    setSelectedCategory("all");
    setSelectedInsurance("all");
  };

  return (
    <div className="space-y-8">
      {/* Interactive Natural Language Search Bar */}
      <div className="rounded-2xl border border-primary/20 bg-card p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono font-bold text-primary tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Search Intent Knowledge Engine</span>
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
              Search by Denial Reason, Insurance, or Problem
            </h2>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {searchResults.length} {searchResults.length === 1 ? "Resource" : "Resources"} Available
          </span>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder='Try: "my claim was denied because of prior authorization" or "medical necessity appeal template"...'
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value.length > 3) {
                trackEvent({ name: "search_intent_query", query: e.target.value });
              }
            }}
            className="w-full rounded-xl border border-border bg-background py-3.5 pl-11 pr-10 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-inner"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                : "bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            All Resources ({allArticles.length})
          </button>
          {SEO_CATEGORIES.map((cat) => {
            const count = allArticles.filter((a) => a.category === cat.category).length;
            return (
              <button
                key={cat.category}
                type="button"
                onClick={() => setSelectedCategory(cat.category)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.category
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {cat.shortTitle} ({count})
              </button>
            );
          })}
        </div>

        {/* Insurance Type Quick Filters */}
        <div className="flex items-center gap-2 pt-1 border-t border-border/60 flex-wrap text-xs">
          <span className="text-muted-foreground font-medium flex items-center gap-1">
            <Filter className="h-3 w-3" /> Insurance Type:
          </span>
          {[
            { id: "all", label: "All Types" },
            { id: "health", label: "Health" },
            { id: "medical", label: "Medical" },
            { id: "dental", label: "Dental" },
            { id: "vision", label: "Vision" },
            { id: "prescription", label: "Prescription" },
            { id: "hospital", label: "Hospital" },
            { id: "medicare", label: "Medicare" },
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setSelectedInsurance(type.id)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                selectedInsurance === type.id
                  ? "bg-foreground text-background font-semibold"
                  : "bg-background border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {type.label}
            </button>
          ))}

          {(selectedCategory !== "all" || selectedInsurance !== "all" || query) && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-[11px] text-primary hover:underline ml-auto font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Search Results Grid */}
      {searchResults.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {searchResults.map((article) => {
            const meta = getCategoryMeta(article.category);
            return (
              <Link
                key={article.id}
                href={article.canonicalPath}
                className="group rounded-xl border border-border bg-card p-5 md:p-6 hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-semibold ${meta.badgeColor}`}>
                      {meta.shortTitle}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="h-3 w-3" />
                      {article.readingTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Explore Guide</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted mx-auto text-muted-foreground">
            <Search className="h-6 w-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-semibold text-foreground">No matching resources found</h3>
            <p className="text-xs text-muted-foreground">
              We couldn&apos;t find an article matching &quot;{query}&quot;. Try searching for medical necessity, prior authorization, or a CARC code like CO-50.
            </p>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="btn-secondary text-xs px-4 py-2"
          >
            Clear Search &amp; Show All
          </button>
        </div>
      )}
    </div>
  );
}
