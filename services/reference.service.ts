import { createClient } from "@/lib/supabase/server";
import type { ReferenceDocument } from "@/types";

/**
 * Reference service — retrieves trusted reference documents for the AI pipeline.
 * For MVP: small static table of manually verified, general appeal-rights guidance.
 * Phase 2+: replaced by RAG / CMS policy retrieval.
 */
export class ReferenceService {
  /**
   * Get all active reference documents.
   */
  static async getActiveReferences(): Promise<ReferenceDocument[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reference_documents")
      .select("*")
      .eq("active", true)
      .order("category");

    if (error) throw new Error(`Failed to load references: ${error.message}`);
    return (data ?? []) as ReferenceDocument[];
  }

  /**
   * Get references by category.
   */
  static async getByCategory(category: string): Promise<ReferenceDocument[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reference_documents")
      .select("*")
      .eq("active", true)
      .eq("category", category);

    if (error) throw new Error(`Failed to load references: ${error.message}`);
    return (data ?? []) as ReferenceDocument[];
  }
}
