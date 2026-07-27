import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";
import { isRegistrationOpen, CLOSED_MESSAGE_BN } from "@/lib/nagorik-songlap";

export default defineTool({
  name: "register_nagorik_songlap_2026",
  title: "Register for নাগরিক সংলাপ ২০২৬",
  description:
    "Register the signed-in user for the PNC নাগরিক সংলাপ ২০২৬ civic dialogue program. The deadline is enforced server-side.",
  inputSchema: {
    name: z.string().trim().min(2).max(100).describe("Full name of the registrant."),
    phone: z
      .string()
      .trim()
      .min(10)
      .max(20)
      .regex(/^[0-9+\-\s()]+$/)
      .describe("Mobile phone number."),
    comment: z.string().trim().max(1000).optional().describe("Optional comment or question."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ name, phone, comment }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    if (!isRegistrationOpen()) {
      return { content: [{ type: "text", text: CLOSED_MESSAGE_BN }], isError: true };
    }
    const email = ctx.getUserEmail();
    if (!email) {
      return {
        content: [{ type: "text", text: "Signed-in account has no email address." }],
        isError: true,
      };
    }
    const { error } = await supabaseForUser(ctx)
      .from("program_registrations")
      .insert({
        name,
        email,
        phone,
        comment: comment ?? null,
        status: "registered",
        source: "mcp",
      });
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    const msg = "ধন্যবাদ! আপনার নিবন্ধন সফলভাবে সম্পন্ন হয়েছে।";
    return {
      content: [{ type: "text", text: msg }],
      structuredContent: { success: true, message: msg },
    };
  },
});
