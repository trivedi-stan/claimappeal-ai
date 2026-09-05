import { createClient } from "@/lib/supabase/server";
import type { Appeal, AppealStatus } from "@/types";

/**
 * Appeal service — CRUD and business logic for appeals.
 * All operations enforce ownership via Supabase RLS.
 */
export class AppealService {
  /**
   * Create a new appeal with draft status.
   */
  static async create(profileId: string, title?: string): Promise<Appeal> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("appeals")
      .insert({
        profile_id: profileId,
        title: title ?? "Untitled Appeal",
        status: "draft" as AppealStatus,
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to create appeal: ${error.message}`);
    return data as Appeal;
  }

  /**
   * List all appeals for the authenticated user.
   */
  static async list(profileId: string): Promise<Appeal[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("appeals")
      .select(
        `
        *,
        insurance_information(*),
        claim_information(*),
        denial_information(*)
      `
      )
      .eq("profile_id", profileId)
      .order("updated_at", { ascending: false });

    if (error) throw new Error(`Failed to list appeals: ${error.message}`);
    return (data ?? []) as Appeal[];
  }

  /**
   * Get a single appeal by ID with all related data.
   */
  static async getById(appealId: string): Promise<Appeal | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("appeals")
      .select(
        `
        *,
        insurance_information(*),
        claim_information(*),
        denial_information(*),
        appeal_versions(*)
      `
      )
      .eq("id", appealId)
      .order("version_number", { foreignTable: "appeal_versions", ascending: false })
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // Not found
      throw new Error(`Failed to get appeal: ${error.message}`);
    }
    return (data as unknown) as Appeal;
  }

  /**
   * Update appeal metadata (title, status).
   */
  static async update(
    appealId: string,
    updates: { title?: string; status?: AppealStatus }
  ): Promise<Appeal> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("appeals")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", appealId)
      .select()
      .single();

    if (error) throw new Error(`Failed to update appeal: ${error.message}`);
    return data as Appeal;
  }

  /**
   * Delete an appeal and all related data (cascades via DB).
   */
  static async delete(appealId: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from("appeals")
      .delete()
      .eq("id", appealId);

    if (error) throw new Error(`Failed to delete appeal: ${error.message}`);
  }

  /**
   * Save insurance information for a given appeal (upsert).
   */
  static async saveInsuranceInfo(
    appealId: string,
    data: {
      company: string;
      plan_type?: string | null;
      member_id?: string | null;
      group_number?: string | null;
    }
  ) {
    const supabase = await createClient();
    const { error } = await supabase.from("insurance_information").upsert(
      {
        appeal_id: appealId,
        ...data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "appeal_id" }
    );
    if (error)
      throw new Error(`Failed to save insurance info: ${error.message}`);
  }

  /**
   * Save claim information for a given appeal (upsert).
   */
  static async saveClaimInfo(
    appealId: string,
    data: {
      claim_number?: string | null;
      date_of_service?: string | null;
      provider_name?: string | null;
      provider_npi?: string | null;
      cpt_codes?: string[] | null;
      diagnosis_codes?: string[] | null;
      amount_billed?: number | null;
      amount_denied?: number | null;
    }
  ) {
    const supabase = await createClient();
    const { error } = await supabase.from("claim_information").upsert(
      {
        appeal_id: appealId,
        ...data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "appeal_id" }
    );
    if (error) throw new Error(`Failed to save claim info: ${error.message}`);
  }

  /**
   * Save denial information for a given appeal (upsert).
   */
  static async saveDenialInfo(
    appealId: string,
    data: {
      denial_reason: string;
      denial_code?: string | null;
      denial_description?: string | null;
      denial_date?: string | null;
    }
  ) {
    const supabase = await createClient();
    const { error } = await supabase.from("denial_information").upsert(
      {
        appeal_id: appealId,
        ...data,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "appeal_id" }
    );
    if (error) throw new Error(`Failed to save denial info: ${error.message}`);
  }

  /**
   * Save supporting information as JSONB on the appeal itself.
   */
  static async saveSupportingInfo(
    appealId: string,
    data: {
      medical_necessity_explanation?: string | null;
      additional_notes?: string | null;
      prior_appeal_attempts?: boolean;
      prior_appeal_details?: string | null;
    }
  ) {
    const supabase = await createClient();
    const { error } = await supabase
      .from("appeals")
      .update({
        supporting_info: data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", appealId);
    if (error)
      throw new Error(`Failed to save supporting info: ${error.message}`);
  }

  /**
   * Get appeal versions for version history.
   */
  static async getVersions(appealId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("appeal_versions")
      .select("*")
      .eq("appeal_id", appealId)
      .order("version_number", { ascending: false });

    if (error) throw new Error(`Failed to get versions: ${error.message}`);
    return data ?? [];
  }
}
