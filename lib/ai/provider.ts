import type { NormalizedAppealInput, StructuredAppealOutput } from "@/types";

/**
 * Abstract AI provider interface.
 * All application code calls AIService.generateAppeal(), never a provider directly.
 * New providers (Gemini, Anthropic, OpenAI) implement this interface without touching calling code.
 */
export interface AIProvider {
  /**
   * Generate a structured appeal letter from normalized denial input.
   */
  generateAppeal(
    input: NormalizedAppealInput
  ): Promise<StructuredAppealOutput>;

  /** Provider identifier for logging */
  readonly name: string;

  /** Model identifier for logging */
  readonly model: string;
}

/**
 * Factory — returns the configured provider based on AI_PROVIDER env var.
 * Defaults to Gemini if not set.
 */
export async function getAIProvider(): Promise<AIProvider> {
  const provider = process.env.AI_PROVIDER ?? "gemini";

  switch (provider.toLowerCase()) {
    case "gemini":
    case "google": {
      const { GeminiProvider } = await import("./gemini.provider");
      return new GeminiProvider();
    }
    case "anthropic":
    case "claude": {
      const { AnthropicProvider } = await import("./anthropic.provider");
      return new AnthropicProvider();
    }
    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }
}
