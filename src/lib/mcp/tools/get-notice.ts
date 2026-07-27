import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";
import { withAudit } from "../audit";

export default defineTool({
  name: "get_notice",
  title: "Get notice",
  description: "Fetch a single PNC notice by slug, including full body text.",
  inputSchema: {
    slug: z.string().trim().min(1).max(200).describe("The notice slug."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: withAudit("get_notice", async ({ slug }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("notices")
      .select(
        "id,slug,title_bn,body_bn,category,priority,starts_at,expires_at,cover_image_path,is_active",
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    if (!data) {
      return { content: [{ type: "text", text: "Notice not found" }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { notice: data },
    };
  }),
});
