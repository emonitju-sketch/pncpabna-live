import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Bell } from "lucide-react";
import logo from "@/assets/pnc-logo.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/academics", label: "Academics" },
  { to: "/admission", label: "Admission" },
  { to: "/faculty", label: "Faculty" },
  { to: "/campus-life", label: "Campus Life" },
  { to: "/notice-board", label: "Notice Board" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="bg-primary text-primary-foreground text-xs">
        <div className="container-pnc flex h-9 items-center justify-between">
          <span className="hidden sm:inline">Government Nursing Education Institution · Pabna, Bangladesh</span>
          <span className="sm:hidden">PNC · Govt. Nursing Institution</span>
          <div className="flex items-center gap-4">
            <a href="tel:+8802588846042" className="hover:text-gold">+880 2588 846042</a>
            <span className="hidden md:inline opacity-80">ncprincipal.pabna@gmail.com</span>
          </div>
        </div>
      </div>

      <div className="container-pnc flex h-20 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Pabna Nursing College logo" width={48} height={48} className="h-12 w-12" />
          <div className="leading-tight">
            <div className="font-display text-lg font-bold text-primary">Pabna Nursing College</div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Government Nursing Education Institution
            </div>
          </div>
        </Link>

        <nav className="hidden xl:flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="px-3 py-2 text-sm font-medium text-foreground/80 rounded-md hover:text-primary hover:bg-primary-soft transition-colors data-[status=active]:text-primary data-[status=active]:bg-primary-soft"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/notice-board"
            className="hidden sm:inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2 text-sm font-semibold text-gold-foreground hover:opacity-90 transition"
          >
            <Bell className="h-4 w-4" /> Notice Board
          </Link>
          <button
            aria-label="Toggle menu"
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
          </nav>
        </div>
      )}
    </header>
  );
}
