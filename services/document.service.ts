import { createClient } from "@/lib/supabase/server";

/**
 * Document service — PDF generation, storage, and retrieval.
 * Uses Supabase Storage for file persistence.
 */
export class DocumentService {
  /**
   * Store a generated PDF in Supabase Storage and create a record.
   */
  static async storePdf(
    appealVersionId: string,
    profileId: string,
    pdfBuffer: Buffer,
    fileName: string
  ): Promise<{ storagePath: string; publicUrl: string }> {
    const supabase = await createClient();
    const storagePath = `${profileId}/${appealVersionId}/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(storagePath, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Failed to upload PDF: ${uploadError.message}`);
    }

    // Create database record
    const { error: dbError } = await supabase
      .from("generated_documents")
      .insert({
        appeal_version_id: appealVersionId,
        storage_path: storagePath,
        file_name: fileName,
        file_size: pdfBuffer.length,
      });

    if (dbError) {
      throw new Error(`Failed to save document record: ${dbError.message}`);
    }

    // Get signed URL (valid for 1 hour)
    const { data: urlData } = await supabase.storage
      .from("documents")
      .createSignedUrl(storagePath, 3600);

    return {
      storagePath,
      publicUrl: urlData?.signedUrl ?? "",
    };
  }

  /**
   * Get a signed download URL for a document.
   */
  static async getDownloadUrl(storagePath: string): Promise<string> {
    const supabase = await createClient();
    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(storagePath, 3600);

    if (error) throw new Error(`Failed to get download URL: ${error.message}`);
    return data.signedUrl;
  }

  /**
   * Get all documents for an appeal version.
   */
  static async getByVersionId(appealVersionId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("generated_documents")
      .select("*")
      .eq("appeal_version_id", appealVersionId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(`Failed to get documents: ${error.message}`);
    return data ?? [];
  }
}
