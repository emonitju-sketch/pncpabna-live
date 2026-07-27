import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ShieldCheck, Sparkles } from "lucide-react";

type AuthorizationDetails = {
  client?: { name?: string | null; client_uri?: string | null } | null;
  redirect_uri?: string | null;
  redirect_url?: string | null;
  redirect_to?: string | null;
  scope?: string | null;
  scopes?: string[] | null;
};

// Beta namespace not yet in @supabase/supabase-js types — local typed wrapper.
type OAuthNS = {
  getAuthorizationDetails: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  approveAuthorization: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
  denyAuthorization: (
    id: string,
  ) => Promise<{ data: AuthorizationDetails | null; error: { message: string } | null }>;
};

function oauth(): OAuthNS {
  return (supabase.auth as unknown as { oauth: OAuthNS }).oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/login", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId =
      new URLSearchParams(location.search).get("authorization_id") ?? "";
    const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) {
      window.location.href = immediate;
      return data;
    }
    return data;
  },
  component: ConsentPage,
  errorComponent: ({ error }) => (
    <main className="container-pnc py-16 max-w-lg">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
        <h1 className="text-xl font-bold text-foreground">অনুমোদন অনুরোধ লোড করা যায়নি</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {String((error as Error)?.message ?? error)}
        </p>
      </div>
    </main>
  ),
});

function ConsentPage() {
  const details = Route.useLoaderData();
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState<"approve" | "deny" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const clientName = details?.client?.name ?? "একটি অ্যাপ্লিকেশন";
  const scopeText = details?.scopes?.join(" ") ?? details?.scope ?? "openid email profile";
  const scopes = scopeText.split(/\s+/).filter(Boolean);

  async function decide(approve: boolean) {
    setBusy(approve ? "approve" : "deny");
    setError(null);
    const { data, error } = approve
      ? await oauth().approveAuthorization(authorization_id)
      : await oauth().denyAuthorization(authorization_id);
    if (error) {
      setError(error.message);
      setBusy(null);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setError("Authorization server did not return a redirect URL.");
      setBusy(null);
      return;
    }
    window.location.href = target;
  }

  return (
    <main className="container-pnc py-12 md:py-20 max-w-lg">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-foreground">
          {clientName}-কে সংযুক্ত করবেন?
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          এটি {clientName}-কে পাবনা নাগরিক কমিটির টুলগুলো আপনার হয়ে ব্যবহার করার অনুমতি দেবে।
          আপনার সাইন-ইন করা অ্যাকাউন্টের সীমার বাইরে কিছু করতে পারবে না।
        </p>

        <div className="mt-6 rounded-lg border border-border bg-muted/40 p-4 text-sm">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <Sparkles className="h-4 w-4 text-[var(--gold)]" /> অনুমতির বিবরণ
          </div>
          <ul className="mt-2 space-y-1 text-muted-foreground">
            {scopes.map((s) => (
              <li key={s}>• {labelFor(s)}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            আপনার ডেটার উপর সাইটের নিয়ম ও ব্যাকএন্ড পলিসি প্রযোজ্য থাকবে।
          </p>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-accent">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => decide(true)}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-95 transition disabled:opacity-60"
          >
            {busy === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            সংযুক্ত করুন
          </button>
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => decide(false)}
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition disabled:opacity-60"
          >
            বাতিল
          </button>
        </div>
      </div>
    </main>
  );
}

function labelFor(scope: string) {
  switch (scope) {
    case "openid":
      return "আপনার অ্যাকাউন্ট আইডি";
    case "email":
      return "আপনার ইমেইল ঠিকানা";
    case "profile":
      return "আপনার সাধারণ প্রোফাইল তথ্য";
    default:
      return `অতিরিক্ত অনুমতি: ${scope}`;
  }
}
