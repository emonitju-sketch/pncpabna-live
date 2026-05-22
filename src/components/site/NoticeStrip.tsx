import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Notice = { id: string; title_bn: string; body_bn: string | null; priority: number };

export function NoticeStrip() {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("notices")
        .select("id, title_bn, body_bn, priority")
        .order("priority", { ascending: false })
        .order("starts_at", { ascending: false })
        .limit(3);
      setNotices((data as Notice[]) || []);
    })();
  }, []);

  if (notices.length === 0) return null;

  return (
    <section className="bg-red-accent/10 border-y border-red-accent/30">
      <div className="container-pnc py-3 flex flex-wrap items-center gap-x-6 gap-y-2">
        <span className="inline-flex items-center gap-2 text-xs font-bold text-red-accent uppercase tracking-wider">
          <Megaphone className="h-4 w-4" /> জরুরি ঘোষণা
        </span>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-foreground">
          {notices.map((n) => (
            <span key={n.id}>
              <strong>{n.title_bn}</strong>
              {n.body_bn && <span className="text-muted-foreground"> — {n.body_bn}</span>}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
