import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_events",
  title: "List events",
  description: "List PNC events, upcoming first. Optionally include only events with open registration.",
  inputSchema: {
    only_open: z
      .boolean()
      .optional()
      .describe("If true, only events with registration currently open."),
    limit: z.number().int().min(1).max(50).optional().describe("Max rows (default 20)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ only_open, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    let q = supabaseForUser(ctx)
      .from("events")
      .select("id,title,description,event_date,location,registration_open,cover_image_path")
      .order("event_date", { ascending: true })
      .limit(limit ?? 20);
    if (only_open) q = q.eq("registration_open", true);
    const { data, error } = await q;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { events: data ?? [] },
    };
  },
});
