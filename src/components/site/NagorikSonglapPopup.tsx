import * as React from "react";
import { Link } from "@tanstack/react-router";
import { X, Sparkles, ArrowRight } from "lucide-react";
import {
  POPUP_KEY,
  EVENT_PATH,
  EVENT_NAME_BN,
  isRegistrationOpen,
} from "@/lib/nagorik-songlap";

export function NagorikSonglapPopup() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.pathname !== "/") return;
    if (!isRegistrationOpen()) return;
    try {
      if (localStorage.getItem(POPUP_KEY)) return;
    } catch {
      return;
    }
    const t = window.setTimeout(() => setOpen(true), 1200);
    return () => window.clearTimeout(t);
  }, []);

  const dismiss = React.useCallback(() => {
    try {
      localStorage.setItem(POPUP_KEY, "true");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }, []);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ns-popup-title"
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-card border border-border shadow-elegant overflow-hidden animate-in slide-in-from-bottom-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="বন্ধ করুন"
          className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-background/80 text-foreground hover:bg-background"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="gradient-hero text-primary-foreground p-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur px-3 py-1 text-xs font-medium border border-white/25">
            <Sparkles className="h-3 w-3 text-[var(--gold)]" /> উন্মুক্ত আমন্ত্রণ
          </span>
          <h2 id="ns-popup-title" className="mt-3 text-2xl font-bold">
            {EVENT_NAME_BN}
          </h2>
          <p className="mt-2 text-sm opacity-95">
            পাবনা নাগরিক কমিটির উন্মুক্ত নাগরিক সংলাপে আপনি আমন্ত্রিত। আজই
            নিবন্ধন করে আপনার আসন নিশ্চিত করুন।
          </p>
        </div>

        <div className="p-6">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>📅 ২৭ জুন ২০২৬</li>
            <li>📍 পাবনা</li>
            <li>⏰ নিবন্ধনের শেষ তারিখ: ২৬ জুন ২০২৬</li>
          </ul>
          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <Link
              to={EVENT_PATH}
              onClick={dismiss}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-red-accent px-4 py-2.5 text-sm font-semibold text-red-accent-foreground hover:opacity-95 transition"
            >
              এখনই নিবন্ধন করুন <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted transition"
            >
              পরে দেখব
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
