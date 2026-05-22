import { useState, type FormEvent } from "react";
import { Lock, KeyRound, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ConstitutionGate({
  onUnlock,
  onSubmit,
}: {
  onUnlock: () => void;
  onSubmit: (passcode: string) => Promise<boolean>;
}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const ok = await onSubmit(code.trim());
      if (ok) {
        onUnlock();
      } else {
        setError("ভুল পাসকোড। অনুগ্রহ করে আবার চেষ্টা করুন।");
      }
    } catch {
      setError("যাচাই করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-2xl border bg-card shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold">সুরক্ষিত নথি — অনুমোদন প্রয়োজন</h2>
          <p className="text-sm text-muted-foreground mt-2">
            গঠনতন্ত্র শুধুমাত্র অনুমোদিত সদস্যদের জন্য উন্মুক্ত। অ্যাক্সেস পেতে আপনার পাসকোড দিন।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              inputMode="numeric"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="পাসকোড"
              className="pl-9"
              disabled={loading}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading || !code.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "আনলক করুন"}
          </Button>
          <p className="text-xs text-muted-foreground text-center pt-2">
            পাসকোড পেতে যোগাযোগ করুন PNC প্রশাসন।
          </p>
        </form>
      </div>
    </div>
  );
}
