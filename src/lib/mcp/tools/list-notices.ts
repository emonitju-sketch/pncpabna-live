import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";
import { withAudit } from "../audit";

export default defineTool({
  name: "list_notices",
  title: "List notice board",
  description:
    "List active PNC notice board announcements (নোটিশ বোর্ড), sorted by priority and start date.",
  inputSchema: {
    category: z
      .string()
      .trim()
      .min(1)
      .max(60)
      .optional()
      .describe("Optional category filter, e.g. ঘোষণা, নোটিশ, সভা."),
    search: z.string().trim().min(1).max(120).optional().describe("Text search in title."),
    limit: z.number().int().min(1).max(50).optional().describe("Max rows (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, search, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    let q = supabaseForUser(ctx)
      .from("notices")
      .select("id,slug,title_bn,category,priority,starts_at,expires_at,cover_image_path")
      .eq("is_active", true)
      .order("priority", { ascending: false })
      .order("starts_at", { ascending: false })
      .limit(limit ?? 20);
    if (category) q = q.eq("category", category);
    if (search) q = q.ilike("title_bn", `%${search}%`);

    const { data, error } = await q;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { notices: data ?? [] },
    };
  },
});
