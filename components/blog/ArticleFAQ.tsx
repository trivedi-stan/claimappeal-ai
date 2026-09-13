"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { FAQItem } from "@/types/blog";

interface ArticleFAQProps {
  faq: FAQItem[];
  title?: string;
}

export function ArticleFAQ({ faq, title = "Frequently Asked Questions" }: ArticleFAQProps) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]); // First open by default

  if (!faq || faq.length === 0) return null;

  const toggleIndex = (idx: number) => {
    if (openIndexes.includes(idx)) {
      setOpenIndexes(openIndexes.filter((i) => i !== idx));
    } else {
      setOpenIndexes([...openIndexes, idx]);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6 my-10 shadow-sm">
      <div className="flex items-center gap-2 text-foreground">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <HelpCircle className="h-4.5 w-4.5" />
        </div>
        <h3 className="text-lg sm:text-xl font-bold tracking-tight">{title}</h3>
      </div>

      <div className="divide-y divide-border/80">
        {faq.map((item, idx) => {
          const isOpen = openIndexes.includes(idx);
          return (
            <div key={idx} className="py-4 first:pt-0 last:pb-0">
              <button
                type="button"
                onClick={() => toggleIndex(idx)}
                className="w-full flex items-center justify-between gap-4 text-left font-semibold text-xs sm:text-sm text-foreground hover:text-primary transition-colors"
                aria-expanded={isOpen}
              >
                <span>{item.question}</span>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </button>

              {isOpen && (
                <div className="mt-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed pl-1 animate-in fade-in-50 duration-150">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
