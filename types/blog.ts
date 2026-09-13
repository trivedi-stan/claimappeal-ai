export interface BlogAuthor {
  name: string;
  role: string;
  avatar?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  level: 2 | 3;
}

export interface BlogCategory {
  slug: string;
  title: string;
  description: string;
  iconName: string; // Lucide icon name representation
  badgeColor?: string;
  pillarTitle?: string;
  pillarDescription?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string; // category slug
  author: BlogAuthor;
  publishedAt: string; // ISO date YYYY-MM-DD
  updatedAt?: string;
  readingTime: string; // e.g. "6 min read"
  featuredImage?: string;
  tags: string[];
  isFeatured?: boolean;
  isPopular?: boolean;
  tableOfContents: TableOfContentsItem[];
  content: string; // Markdown or structured sections
  keyTakeaways?: string[];
  statutoryAlert?: {
    title: string;
    description: string;
    citation?: string;
  };
  faq?: FAQItem[];
  relatedSlugs: string[];
}
