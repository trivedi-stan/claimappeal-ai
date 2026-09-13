import Link from "next/link";
import { ChevronRight, ArrowRight, Shield, Clock } from "lucide-react";
import { SeoCategory } from "@/types/seo-content";
import { getCategoryMeta, getArticlesByCategory } from "@/lib/seo-engine";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

interface CategoryHubPageProps {
  category: SeoCategory;
}

export function CategoryHubPage({ category }: CategoryHubPageProps) {
  const categoryMeta = getCategoryMeta(category);
  const articles = getArticlesByCategory(category);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/20">
      <SiteHeader />

      <main className="flex-1 py-10 md:py-14">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 space-y-12">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
            <Link href="/blog" className="hover:text-foreground transition-colors">
              Resources
            </Link>
            <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
            <span className="text-foreground font-medium">{categoryMeta.shortTitle}</span>
          </nav>

          {/* Hero Header */}
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary">
              <Shield className="h-3.5 w-3.5" />
              <span>ClaimAppeal AI Category Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {categoryMeta.title}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {categoryMeta.description}
            </p>
          </div>

          {/* Articles Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={article.canonicalPath}
                className="group rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    {article.denialCode ? (
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary">
                        CARC {article.denialCode}
                      </span>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-full border ${categoryMeta.badgeColor} text-[10px] font-medium`}>
                        {categoryMeta.shortTitle}
                      </span>
                    )}
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Clock className="h-3 w-3" />
                      {article.readingTime}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {article.title}
                  </h2>

                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-primary">
                  <span>Explore Guide</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
