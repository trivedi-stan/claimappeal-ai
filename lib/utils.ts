import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

/** Merge Tailwind classes without conflicts */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Generate a unique request ID for API responses */
export function generateRequestId(): string {
  return `req_${uuidv4().replace(/-/g, "").substring(0, 16)}`;
}

/** Format currency (USD) */
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

/** Format a date string for display */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Capitalize first letter */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Truncate text with ellipsis */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + "...";
}

/** Safe JSON parse — returns null on failure, never throws */
export function safeJsonParse<T>(json: string): T | null {
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

/** Human-readable appeal status labels */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: "Draft",
    in_progress: "In Progress",
    generated: "Generated",
    submitted: "Submitted",
    approved: "Approved",
    denied: "Denied",
  };
  return labels[status] ?? capitalize(status);
}

/** Status badge color class names */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700",
    in_progress: "bg-blue-100 text-blue-700",
    generated: "bg-emerald-100 text-emerald-700",
    submitted: "bg-amber-100 text-amber-700",
    approved: "bg-green-100 text-green-700",
    denied: "bg-red-100 text-red-700",
  };
  return colors[status] ?? "bg-gray-100 text-gray-700";
}
