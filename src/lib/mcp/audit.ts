import { createClient } from "@supabase/supabase-js";
import type { ToolContext } from "@lovable.dev/mcp-js";
import type { Database } from "@/integrations/supabase/types";

// Structural view of a tool result — enough to inspect isError/content
// without depending on the SDK's exact ContentBlock union.
type ToolResultLike = {
  content?: ReadonlyArray<{ type?: string; text?: string } & Record<string, unknown>>;
  isError?: boolean;
  structuredContent?: unknown;
};

type ToolHandler<I, R> = (input: I, ctx: ToolContext) => Promise<R> | R;

function adminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Redact obviously sensitive fields; cap the string length. */
function summarizeInput(input: unknown): Record<string, unknown> | null {
  if (!input || typeof input !== "object") return null;
  const REDACT = new Set(["phone", "email", "token", "password", "secret"]);
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (REDACT.has(k.toLowerCase())) {
      out[k] = typeof v === "string" && v.length > 0 ? `***${v.slice(-2)}` : "***";
    } else if (typeof v === "string") {
      out[k] = v.length > 200 ? v.slice(0, 200) + "…" : v;
    } else {
      out[k] = v;
    }
  }
  return out;
}

function extractError(result: ToolResultLike): string | null {
  if (!result?.isError) return null;
  const first = result.content?.[0];
  return first?.text?.slice(0, 500) ?? "unknown error";
}

/** Fire-and-forget audit log write; never blocks or throws into tool response. */
async function writeLog(row: Record<string, unknown>) {
  const client = adminClient();
  if (!client) {
    console.warn("[mcp-audit] service role unavailable; skipping log");
    return;
  }
  const { error } = await client.from("mcp_audit_logs").insert(row as never);
  if (error) console.warn("[mcp-audit] insert failed:", error.message);
}

/**
 * Wrap a tool handler so every invocation is recorded to `mcp_audit_logs`.
 * Records: tool_name, caller identity (from verified OAuth token), duration,
 * success/error, and a redacted summary of the input. Logging failures are
 * swallowed — auditing must never break a tool call.
 */
export function withAudit<H extends (input: any, ctx: ToolContext) => any>(
  toolName: string,
  handler: H,
): H {
  const wrapped = async (input: Parameters<H>[0], ctx: ToolContext) => {
    const startedAt = Date.now();
    let result: ToolResultLike;
    let threw: unknown = null;
    try {
      result = await handler(input, ctx);
    } catch (err) {
      threw = err;
      result = {
        content: [{ type: "text", text: err instanceof Error ? err.message : "Internal error" }],
        isError: true,
      };
    }
    const durationMs = Date.now() - startedAt;
    const success = !result.isError && !threw;
    const errorMessage = threw
      ? (threw instanceof Error ? threw.message : String(threw)).slice(0, 500)
      : extractError(result);

    // Structured console line — surfaced in Worker logs for real-time monitoring.
    console.log(
      JSON.stringify({
        level: success ? "info" : "warn",
        scope: "mcp.tool",
        tool: toolName,
        user_id: ctx.isAuthenticated() ? ctx.getUserId() : null,
        client_id: ctx.isAuthenticated() ? ctx.getClientId?.() ?? null : null,
        duration_ms: durationMs,
        success,
        error: errorMessage,
      }),
    );

    // Persist — awaited so Workers don't drop the request; failures are swallowed.
    await writeLog({
      tool_name: toolName,
      user_id: ctx.isAuthenticated() ? ctx.getUserId() : null,
      user_email: ctx.isAuthenticated() ? ctx.getUserEmail?.() ?? null : null,
      client_id: ctx.isAuthenticated() ? ctx.getClientId?.() ?? null : null,
      success,
      error_message: errorMessage,
      duration_ms: durationMs,
      input_summary: summarizeInput(input),
    });

    if (threw) throw threw;
    return result;
  };
}
