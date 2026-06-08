import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { isRegistrationOpen, CLOSED_MESSAGE_BN } from "@/lib/nagorik-songlap";

const RegistrationSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z
    .string()
    .trim()
    .min(10)
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, { message: "Invalid phone number" }),
  comment: z.string().trim().max(1000).optional().nullable(),
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

export const Route = createFileRoute("/api/public/nagorik-songlap-2026")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        // Deadline check (server is the final authority)
        if (!isRegistrationOpen()) {
          return jsonResponse(
            { success: false, message: CLOSED_MESSAGE_BN },
            403,
          );
        }

        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return jsonResponse(
            { success: false, message: "অবৈধ অনুরোধ।" },
            400,
          );
        }

        const parsed = RegistrationSchema.safeParse(raw);
        if (!parsed.success) {
          return jsonResponse(
            {
              success: false,
              message: "সব তথ্য সঠিকভাবে পূরণ করুন।",
              errors: parsed.error.flatten().fieldErrors,
            },
            400,
          );
        }

        const ip =
          request.headers.get("cf-connecting-ip") ||
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          request.headers.get("x-real-ip") ||
          "unknown";
        const userAgent = request.headers.get("user-agent") || "unknown";

        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );

        // Rate limit: 5 submissions per hour per IP
        if (ip && ip !== "unknown") {
          const sinceIso = new Date(Date.now() - 60 * 60 * 1000).toISOString();
          const { count, error: countError } = await supabaseAdmin
            .from("program_registrations")
            .select("id", { count: "exact", head: true })
            .eq("ip_address", ip)
            .gte("created_at", sinceIso);

          if (countError) {
            console.error("[nagorik-songlap] rate-limit query failed", countError);
          } else if ((count ?? 0) >= 5) {
            return jsonResponse(
              {
                success: false,
                message:
                  "অনেকবার চেষ্টা করা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন।",
              },
              429,
            );
          }
        }

        const { error } = await supabaseAdmin
          .from("program_registrations")
          .insert({
            name: parsed.data.name,
            email: parsed.data.email,
            phone: parsed.data.phone,
            comment: parsed.data.comment || null,
            ip_address: ip,
            user_agent: userAgent.slice(0, 500),
            status: "registered",
            source: "website",
          });

        if (error) {
          console.error("[nagorik-songlap] insert failed", error);
          return jsonResponse(
            {
              success: false,
              message: "নিবন্ধন সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।",
            },
            500,
          );
        }

        return jsonResponse({
          success: true,
          message: "ধন্যবাদ! আপনার নিবন্ধন সফলভাবে সম্পন্ন হয়েছে।",
        });
      },
    },
  },
});
