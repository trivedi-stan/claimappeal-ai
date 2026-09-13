"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShieldAlert, ArrowRight, BookOpen, Scale, Sparkles } from "lucide-react";
import { COMMON_DENIAL_CODES, DenialCodeInfo } from "@/data/denial-codes";
import { trackEvent } from "@/lib/analytics";

export function DenialCodeLookup() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCode, setSelectedCode] = useState<DenialCodeInfo>(COMMON_DENIAL_CODES[0]);

  const filteredCodes = COMMON_DENIAL_CODES.filter(
    (item) =>
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="rounded-2xl border border-border/80 bg-card/60 p-6 md:p-8 backdrop-blur-sm shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-primary font-semibold">
            <ShieldAlert className="h-4 w-4" />
            <span>INSTANT EOB / CARC CODE DECODER</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1">
            Decode Your Denial Code &amp; Legal Strategy
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xl">
            Check your Explanation of Benefits (EOB) for the Claim Adjustment Reason Code (CARC) to see the carrier&apos;s automated strategy and your legal rebuttal standard.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search code (e.g., CO-50, 197)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Code Buttons Selector */}
      <div className="flex flex-wrap gap-2 pt-1 border-t border-border/60">
        {filteredCodes.map((item) => (
          <button
            key={item.code}
            type="button"
            onClick={() => {
              setSelectedCode(item);
              trackEvent({
                name: "denial_code_selected",
                code: item.code,
                category: item.category,
              });
            }}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              selectedCode.code === item.code
                ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                : "border border-border/80 bg-background/80 text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <span className="font-mono font-bold">{item.code}</span>
            <span className="text-[11px] opacity-85">({item.category})</span>
          </button>
        ))}
      </div>

      {/* Details Box */}
      {selectedCode && (
        <div className="rounded-xl border border-border bg-background/90 p-5 md:p-6 space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-lg font-extrabold text-primary px-2.5 py-1 rounded bg-primary/10 border border-primary/20">
                {selectedCode.code}
              </span>
              <div>
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider block">
                  {selectedCode.category}
                </span>
                <p className="text-xs text-muted-foreground italic">&ldquo;{selectedCode.description}&rdquo;</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-border bg-muted/60 text-muted-foreground shrink-0">
              Official CARC Standard
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 text-xs">
            <div className="rounded-lg border border-border/60 bg-card/40 p-4 space-y-1.5">
              <span className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Carrier&apos;s Automated Playbook
              </span>
              <p className="text-muted-foreground leading-relaxed">{selectedCode.carrierStrategy}</p>
            </div>

            <div className="rounded-lg border border-border/60 bg-card/40 p-4 space-y-1.5">
              <span className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5 text-primary" />
                Statutory &amp; Legal Standard
              </span>
              <p className="text-muted-foreground leading-relaxed">{selectedCode.legalStandard}</p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border/60">
            <Link
              href={`/blog/${selectedCode.targetArticleSlug}`}
              className="text-xs font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Read Full Playbook: How to Rebut {selectedCode.code}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>

            <Link
              href={`/signup?code=${encodeURIComponent(selectedCode.code)}`}
              onClick={() =>
                trackEvent({
                  name: "denial_code_cta_click",
                  code: selectedCode.code,
                })
              }
              className="btn-primary text-xs px-4 py-2 font-semibold inline-flex items-center gap-1.5 w-full sm:w-auto justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Draft Rebuttal for {selectedCode.code} (Free)</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
