import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_activities",
  title: "List activities",
  description:
    "List published PNC civic activities (কার্যক্রম), most recent first. Optional category filter and limit.",
  inputSchema: {
    category: z
      .string()
      .trim()
      .min(1)
      .max(60)
      .optional()
      .describe("Optional category filter, e.g. জনস্বার্থ, নাগরিক মতামত."),
    limit: z.number().int().min(1).max(50).optional().describe("Max rows (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    let q = supabaseForUser(ctx)
      .from("activities")
      .select(
        "id,title_bn,description_bn,category,activity_date,location,is_featured,external_url,cover_image_path",
      )
      .eq("is_published", true)
      .order("is_featured", { ascending: false })
      .order("activity_date", { ascending: false, nullsFirst: false })
      .limit(limit ?? 20);
    if (category) q = q.eq("category", category);

    const { data, error } = await q;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { activities: data ?? [] },
    };
  },
});
