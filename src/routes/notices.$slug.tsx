import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, FileText, Download, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { publicUrl } from "@/hooks/use-auth";

export const Route = createFileRoute("/notices/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `নোটিশ — পাবনা নাগরিক কমিটি` },
      { name: "description", content: "পাবনা নাগরিক কমিটির অফিসিয়াল নোটিশ ও বিজ্ঞপ্তির বিস্তারিত।" },
      { property: "og:title", content: "নোটিশ — পিএনসি" },
      { property: "og:url", content: `https://pncpab.lovable.app/notices/${params.slug}` },
    ],
  }),
  component: NoticeDetailPage,
  errorComponent: ({ error, reset }) => (
    <div className="container-pnc py-16 text-center">
      <p className="text-destructive">নোটিশ লোড করা যায়নি।</p>
      <button onClick={reset} className="mt-3 text-primary underline text-sm">আবার চেষ্টা করুন</button>
    </div>
  ),
  notFoundComponent: () => (
    <div className="container-pnc py-16 text-center">
      <p className="text-muted-foreground">নোটিশ পাওয়া যায়নি।</p>
      <Link to="/notices" className="mt-3 inline-block text-primary underline text-sm">নোটিশ বোর্ডে ফিরুন</Link>
    </div>
  ),
});

type Notice = {
  id: string;
  slug: string | null;
  title_bn: string;
  body_bn: string | null;
  category: string;
  starts_at: string;
  expires_at: string | null;
  cover_image_path: string | null;
};

function NoticeDetailPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      // Try slug first, then fall back to id
      let { data } = await (supabase as any)
        .from("notices")
        .select("id, slug, title_bn, body_bn, category, starts_at, expires_at, cover_image_path")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (!data) {
        const res = await (supabase as any)
          .from("notices")
          .select("id, slug, title_bn, body_bn, category, starts_at, expires_at, cover_image_path")
          .eq("id", slug)
          .eq("is_active", true)
          .maybeSingle();
        data = res.data;
      }

      if (!data) setNotFound(true);
      else setNotice(data as Notice);
      setLoading(false);
    })();
  }, [slug]);

  const handleShare = async () => {
    if (!notice) return;
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: notice.title_bn, url }); } catch { /* dismissed */ }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  if (loading) {
    return <div className="container-pnc py-16 text-center text-muted-foreground">লোড হচ্ছে…</div>;
  }
  if (notFound || !notice) {
    return (
      <div className="container-pnc py-16 text-center">
        <p className="text-muted-foreground">নোটিশ পাওয়া যায়নি।</p>
        <Link to="/notices" className="mt-3 inline-block text-primary underline text-sm">নোটিশ বোর্ডে ফিরুন</Link>
      </div>
    );
  }

  const imageUrl = notice.cover_image_path ? publicUrl("gallery", notice.cover_image_path) : null;
  const bnDate = new Date(notice.starts_at).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" });

  return (
    <article className="container-pnc max-w-4xl py-10 md:py-14">
      <button
        onClick={() => navigate({ to: "/notices" })}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition"
      >
        <ArrowLeft className="h-4 w-4" /> নোটিশ বোর্ডে ফিরুন
      </button>

      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 font-medium text-primary">
          <FileText className="h-3 w-3" />{notice.category}
        </span>
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Calendar className="h-3 w-3" />{bnDate}
        </span>
      </div>

      <h1 className="mt-4 text-2xl md:text-3xl font-bold leading-tight text-foreground">
        {notice.title_bn}
      </h1>

      <div className="mt-6 flex items-center gap-3">
        {imageUrl && (
          <a
            href={imageUrl}
            download
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium hover:border-primary/40 transition"
          >
            <Download className="h-3.5 w-3.5" /> মূল নোটিশ ডাউনলোড
          </a>
        )}
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-sm font-medium hover:border-primary/40 transition"
        >
          <Share2 className="h-3.5 w-3.5" /> শেয়ার করুন
        </button>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_1.1fr]">
        {imageUrl && (
          <div className="rounded-2xl overflow-hidden border border-border bg-muted">
            <a href={imageUrl} target="_blank" rel="noopener noreferrer">
              <img src={imageUrl} alt={notice.title_bn} className="w-full h-auto object-contain" />
            </a>
          </div>
        )}
        {notice.body_bn && (
          <div className="prose prose-sm md:prose-base max-w-none text-foreground/90 leading-relaxed whitespace-pre-line">
            {notice.body_bn}
          </div>
        )}
      </div>
    </article>
  );
}
