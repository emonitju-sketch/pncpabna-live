import type { ToolContext } from "@lovable.dev/mcp-js";

export type MockCtxOptions = {
  authenticated?: boolean;
  userId?: string;
  email?: string | null;
  token?: string;
  clientId?: string;
  claims?: Record<string, unknown>;
};

/**
 * Build a ToolContext-compatible object for direct handler invocation in
 * tests. Mirrors the accessors mcp-js exposes to tool handlers.
 */
export function mockCtx(opts: MockCtxOptions = {}): ToolContext {
  const authenticated = opts.authenticated ?? true;
  const userId = opts.userId ?? process.env.TEST_USER_ID ?? "test-user";
  const email = opts.email === undefined ? process.env.TEST_USER_EMAIL ?? null : opts.email;
  const token = opts.token ?? process.env.TEST_USER_ACCESS_TOKEN ?? "";
  const clientId = opts.clientId ?? "test-client";
  const claims = opts.claims ?? { sub: userId, email, client_id: clientId };

  return {
    isAuthenticated: () => authenticated,
    getUserId: () => userId,
    getUserEmail: () => email,
    getClientId: () => clientId,
    getClaims: () => claims,
    getToken: () => token,
  } as unknown as ToolContext;
}

/**
 * Skip a whole test file when a live-Supabase access token is not
 * available. Prevents CI noise when secrets are absent.
 */
export function requireLiveAuth(): { skip: boolean; reason: string } {
  if (!process.env.TEST_USER_ACCESS_TOKEN) {
    return {
      skip: true,
      reason:
        "TEST_USER_ACCESS_TOKEN not set — see tests/mcp/README.md to generate one.",
    };
  }
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_PUBLISHABLE_KEY) {
    return { skip: true, reason: "SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY missing." };
  }
  return { skip: false, reason: "" };
}

export function extractText(result: {
  content?: Array<{ type: string; text?: string }>;
}): string {
  return result.content?.map((c) => c.text ?? "").join("\n") ?? "";
}

export function parseJson<T = unknown>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
