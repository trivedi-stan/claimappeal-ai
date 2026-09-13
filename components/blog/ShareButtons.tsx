"use client";

import { useState } from "react";
import { Share2, Link2, Check, Twitter, Linkedin, Mail } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/blog/${slug}`;
    }
    return `https://claimappeal.ai/blog/${slug}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      toast.success("Article link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: getUrl(),
        });
      } catch {
        // User canceled share
      }
    } else {
      handleCopy();
    }
  };

  const shareTwitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title
  )}&url=${encodeURIComponent(getUrl())}`;

  const shareLinkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    getUrl()
  )}`;

  const shareMailUrl = `mailto:?subject=${encodeURIComponent(
    title
  )}&body=${encodeURIComponent(`Check out this healthcare appeal guide: ${getUrl()}`)}`;

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-muted-foreground mr-1 hidden sm:inline text-[11px] font-medium uppercase tracking-wider">
        Share:
      </span>

      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        title="Copy article link"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-emerald-500 font-medium">Copied</span>
          </>
        ) : (
          <>
            <Link2 className="h-3.5 w-3.5" />
            <span>Copy</span>
          </>
        )}
      </button>

      <a
        href={shareTwitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        title="Share on X"
      >
        <Twitter className="h-3.5 w-3.5" />
      </a>

      <a
        href={shareLinkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        title="Share on LinkedIn"
      >
        <Linkedin className="h-3.5 w-3.5" />
      </a>

      <a
        href={shareMailUrl}
        className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        title="Email guide"
      >
        <Mail className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}
