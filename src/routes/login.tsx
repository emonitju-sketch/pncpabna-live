import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, LogIn } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "লগইন — পিএনসি" },
      { name: "robots", content: "noindex" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({
    next: typeof s.next === "string" ? s.next : "",
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email("সঠিক ইমেইল দিন").max(255),
  password: z.string().min(6, "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে").max(72),
});

// Only allow same-origin relative paths as post-login redirect.
function safeNext(next: string | undefined): string | null {
  if (!next) return null;
  if (!next.startsWith("/") || next.startsWith("//")) return null;
  return next;
}

function LoginPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword(parsed.data);
      if (error) throw error;
      toast.success("সফলভাবে লগইন হয়েছে");
      const dest = safeNext(next);
      if (dest) {
        window.location.href = dest;
      } else {
        navigate({ to: "/admin" });
      }
    } catch (err) {
      console.error(err);
      toast.error("ইমেইল বা পাসওয়ার্ড সঠিক নয়।");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="container-pnc py-16 md:py-24 max-w-md">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-foreground">অ্যাডমিন লগইন</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          কনটেন্ট ম্যানেজ করতে অনুমোদিত অ্যাডমিন হিসেবে লগইন করুন। নতুন অ্যাকাউন্ট শুধু আমন্ত্রণ সাপেক্ষে তৈরি হয়।
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">ইমেইল</Label>
            <Input id="email" name="email" type="email" autoComplete="email" className="mt-1.5" required />
          </div>
          <div>
            <Label htmlFor="password">পাসওয়ার্ড</Label>
            <Input id="password" name="password" type="password" autoComplete="current-password" className="mt-1.5" required />
          </div>
          <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-60">
            <LogIn className="h-4 w-4" /> লগইন
          </button>
        </form>

        <Link to="/" className="mt-6 block text-center text-xs text-muted-foreground hover:text-primary">← হোমে ফিরে যান</Link>
      </div>
    </section>
  );
}
