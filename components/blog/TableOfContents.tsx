"use client";

import { useState, useEffect } from "react";
import { List, ChevronDown, ChevronUp } from "lucide-react";
import { TableOfContentsItem } from "@/types/blog";

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0% -70% 0%" }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Table of contents" className="w-full">
      {/* Mobile Collapsible View */}
      <div className="lg:hidden rounded-xl border border-border bg-card p-4 mb-6">
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="w-full flex items-center justify-between text-xs font-semibold text-foreground"
        >
          <span className="flex items-center gap-2">
            <List className="h-4 w-4 text-primary" />
            Table of Contents ({items.length} sections)
          </span>
          {isOpenMobile ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {isOpenMobile && (
          <ul className="mt-3 pt-3 border-t border-border space-y-2 text-xs">
            {items.map((item) => (
              <li key={item.id} className={item.level === 3 ? "pl-3" : ""}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setIsOpenMobile(false)}
                  className={`block py-1 text-muted-foreground hover:text-foreground transition-colors ${
                    activeId === item.id ? "text-primary font-semibold" : ""
                  }`}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Desktop Sticky Sidebar View */}
      <div className="hidden lg:block sticky top-24 rounded-xl border border-border bg-card p-5 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-foreground pb-2 border-b border-border">
          <List className="h-4 w-4 text-primary" />
          <span>In this guide</span>
        </div>

        <ul className="space-y-1.5 text-xs">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id} className={item.level === 3 ? "pl-3" : ""}>
                <a
                  href={`#${item.id}`}
                  className={`block py-1 text-xs transition-colors rounded px-2 ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {item.title}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
