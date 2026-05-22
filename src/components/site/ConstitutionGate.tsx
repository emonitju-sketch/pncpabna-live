import { useState, type FormEvent } from "react";
import { Lock, KeyRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PASSCODE = "14142164";
const STORAGE_KEY = "pnc_constitution_unlocked";

export function useConstitutionUnlocked() {
  const [unlocked, setUnlocked] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(STORAGE_KEY) === "1";
  });
  return {
    unlocked,
    unlock: () => {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
    },
  };
}

export function ConstitutionGate({ onUnlock }: { onUnlock: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (code.trim() === PASSCODE) {
      setError("");
      onUnlock();
    } else {
      setError("ভুল পাসকোড। অনুগ্রহ করে আবার চেষ্টা করুন।");
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
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">আনলক করুন</Button>
          <p className="text-xs text-muted-foreground text-center pt-2">
            পাসকোড পেতে যোগাযোগ করুন PNC প্রশাসন।
          </p>
        </form>
      </div>
    </div>
  );
}
