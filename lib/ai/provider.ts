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
  const rawProvider = process.env.AI_PROVIDER ?? "openrouter";
  const provider = rawProvider.toLowerCase().trim();

  // If set to openrouter, open_router, or accidental OPENROUTER_API_KEY
  if (
    provider.includes("openrouter") ||
    provider.includes("open_router")
  ) {
    const { OpenRouterProvider } = await import("./openrouter.provider");
    return new OpenRouterProvider();
  }

  switch (provider) {
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
    default: {
      // If OPENROUTER_API_KEY exists in env, gracefully use openrouter
      if (process.env.OPENROUTER_API_KEY) {
        const { OpenRouterProvider } = await import("./openrouter.provider");
        return new OpenRouterProvider();
      }
      throw new Error(`Unknown AI provider: ${rawProvider}`);
    }
  }
}
