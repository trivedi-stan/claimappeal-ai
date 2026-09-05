/**
 * Input sanitization and prompt injection detection utilities.
 * Protects AI generation pipeline and database against malicious user input.
 */

// Patterns commonly used in prompt injection / jailbreak attacks
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules)/i,
  /disregard\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules)/i,
  /you\s+are\s+now\s+(a|an)?\s*(unfiltered|jailbroken|dan|developer mode)/i,
  /system\s*prompt\s*override/i,
  /output\s+the\s+(system\s+prompt|initial\s+instructions)/i,
  /reveal\s+your\s+(secret|instructions|hidden\s+prompt)/i,
  /bypass\s+(safety|content\s+filters|guidelines)/i,
  /as\s+an\s+ai\s+without\s+restrictions/i,
  /\bDAN\s+mode\b/i,
  /<\|im_start\|>/i,
  /<\|im_end\|>/i,
  /\[INST\]/i,
  /\[\/INST\]/i,
];

export interface PromptInjectionCheckResult {
  isSuspicious: boolean;
  matchedPattern?: string;
  reason?: string;
}

/**
 * Checks a string for common prompt injection and jailbreak phrases.
 */
export function detectPromptInjection(input: string): PromptInjectionCheckResult {
  if (!input || typeof input !== "string") {
    return { isSuspicious: false };
  }

  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      return {
        isSuspicious: true,
        matchedPattern: pattern.source,
        reason: `Input contains potential prompt injection syntax matching: ${pattern.source}`,
      };
    }
  }

  return { isSuspicious: false };
}

/**
 * Sanitizes free-form text input by stripping zero-width characters,
 * abnormal control characters, and normalizing unicode spaces.
 */
export function sanitizeTextInput(input: string): string {
  if (!input || typeof input !== "string") return "";

  return input
    // Remove zero-width characters
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    // Remove null bytes and non-printable control characters (except newline, tab, carriage return)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    // Normalize newlines
    .replace(/\r\n/g, "\n")
    .trim();
}

/**
 * Recursively scans an object for suspicious prompt injection patterns in string values.
 */
export function scanObjectForInjection(
  data: Record<string, unknown>
): { hasInjection: boolean; field?: string; reason?: string } {
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      const result = detectPromptInjection(value);
      if (result.isSuspicious) {
        return { hasInjection: true, field: key, reason: result.reason };
      }
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      const nestedResult = scanObjectForInjection(value as Record<string, unknown>);
      if (nestedResult.hasInjection) {
        return {
          hasInjection: true,
          field: `${key}.${nestedResult.field}`,
          reason: nestedResult.reason,
        };
      }
    } else if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        const item = value[i];
        if (typeof item === "string") {
          const result = detectPromptInjection(item);
          if (result.isSuspicious) {
            return {
              hasInjection: true,
              field: `${key}[${i}]`,
              reason: result.reason,
            };
          }
        }
      }
    }
  }

  return { hasInjection: false };
}
