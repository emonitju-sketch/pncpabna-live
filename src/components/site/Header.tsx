import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Users } from "lucide-react";
import logo from "@/assets/pnc-logo.png";

const nav = [
  { to: "/", label: "হোম" },
  { to: "/about", label: "আমাদের সম্পর্কে" },
  { to: "/council", label: "কমিটি" },
  { to: "/activities", label: "কার্যক্রম" },
  { to: "/events", label: "ইভেন্ট" },
  { to: "/news", label: "সংবাদ" },
  { to: "/notices", label: "নোটিশ" },
  { to: "/gallery", label: "গ্যালারি" },
  { to: "/reports", label: "প্রতিবেদন" },
  { to: "/constitution", label: "গঠনতন্ত্র" },
  { to: "/membership", label: "সদস্য হোন" },
  { to: "/contact", label: "যোগাযোগ" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70 shadow-[0_1px_0_0_color-mix(in_oklab,var(--primary)_8%,transparent)]">
      <div className="gradient-hero text-primary-foreground text-xs">
        <div className="container-pnc flex h-9 items-center justify-between">
          <span className="hidden sm:inline">পাবনা সদর, পাবনা, বাংলাদেশ</span>
          <span className="sm:hidden">পিএনসি · পাবনা</span>
          <div className="flex items-center gap-4">
            <a href="tel:+8801716808074" className="hover:text-white/80">+৮৮০ ১৭১৬-৮০৮০৭৪</a>
            <span className="hidden md:inline opacity-90">pnc.pabna@outlook.com</span>
          </div>
        </div>
      </div>
      <div className="gold-strip" />

      <div className="container-pnc flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="পিএনসি লোগো" width={48} height={48} className="h-12 w-12" />
          <div className="leading-tight">
            <div className="font-display text-base md:text-lg font-bold text-primary">পাবনা নাগরিক কমিটি - পিএনসি</div>
            <div className="text-[11px] md:text-xs text-muted-foreground">নাগরিক ঐক্যেই বদলাবে পাবনা</div>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="relative px-3 py-2 text-sm font-medium text-foreground/80 rounded-md hover:text-primary transition-colors data-[status=active]:text-primary after:content-[''] after:absolute after:left-3 after:right-3 after:-bottom-0.5 after:h-0.5 after:bg-[var(--gold)] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100 data-[status=active]:after:scale-x-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/membership"
            className="shine-on-hover hidden sm:inline-flex items-center gap-2 rounded-lg bg-red-accent px-4 py-2 text-sm font-semibold text-red-accent-foreground hover:opacity-95 transition shadow-elegant"
          >
            <Users className="h-4 w-4" /> আমাদের সাথে যুক্ত হোন
          </Link>
          <button
            aria-label="মেনু"
            onClick={() => setOpen((v) => !v)}
            className="xl:hidden inline-flex items-center justify-center rounded-md border border-border h-10 w-10"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="xl:hidden border-t border-border bg-background">
          <nav className="container-pnc flex flex-col py-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: item.to === "/" }}
                className="px-3 py-3 text-sm font-medium rounded-md hover:bg-primary-soft data-[status=active]:text-primary data-[status=active]:bg-primary-soft"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/membership"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-red-accent px-4 py-2.5 text-sm font-semibold text-red-accent-foreground"
            >
              <Users className="h-4 w-4" /> আমাদের সাথে যুক্ত হোন
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
