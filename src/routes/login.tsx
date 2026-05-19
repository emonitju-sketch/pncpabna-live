import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, LogIn, UserPlus } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "অ্যাডমিন লগইন — পিএনসি" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().trim().email("সঠিক ইমেইল দিন").max(255),
  password: z.string().min(6, "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে").max(72),
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw error;
        toast.success("সফলভাবে লগইন হয়েছে");
      } else {
        const { error } = await supabase.auth.signUp({
          ...parsed.data,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("অ্যাকাউন্ট তৈরি হয়েছে");
      }
      navigate({ to: "/admin" });
    } catch (err: any) {
      toast.error(err.message || "ত্রুটি ঘটেছে");
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
        <h1 className="mt-4 text-2xl font-bold text-foreground">{mode === "signin" ? "অ্যাডমিন লগইন" : "অ্যাকাউন্ট তৈরি করুন"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin" ? "কনটেন্ট ম্যানেজ করতে লগইন করুন।" : "নতুন অ্যাডমিন অ্যাকাউন্ট খুলুন।"}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">ইমেইল</Label>
            <Input id="email" name="email" type="email" autoComplete="email" className="mt-1.5" required />
          </div>
          <div>
            <Label htmlFor="password">পাসওয়ার্ড</Label>
            <Input id="password" name="password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} className="mt-1.5" required />
          </div>
          <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-60">
            {mode === "signin" ? <><LogIn className="h-4 w-4" /> লগইন</> : <><UserPlus className="h-4 w-4" /> সাইন আপ</>}
          </button>
        </form>

        <button onClick={() => setMode((m) => m === "signin" ? "signup" : "signin")} className="mt-4 w-full text-sm text-muted-foreground hover:text-primary">
          {mode === "signin" ? "অ্যাকাউন্ট নেই? সাইন আপ করুন" : "অ্যাকাউন্ট আছে? লগইন করুন"}
        </button>

        <Link to="/" className="mt-6 block text-center text-xs text-muted-foreground hover:text-primary">← হোমে ফিরে যান</Link>
      </div>
    </section>
  );
}
