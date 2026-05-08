import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/pnc-logo.png";

export function Footer() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="container-pnc py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" width={48} height={48} className="h-12 w-12 bg-white rounded-full p-1" />
            <div>
              <div className="font-display text-lg font-bold">Pabna Nursing College</div>
              <div className="text-xs opacity-80 uppercase tracking-wider">Government Nursing Institution</div>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm opacity-90">
            Pabna Nursing College — Developing skilled, ethical, and compassionate nursing
            professionals for Bangladesh.
          </p>
          <div className="mt-6 space-y-2 text-sm">
            <p className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gold" /> 250 Bedded General Hospital Area, Pabna, Bangladesh</p>
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" /> +880 2588 846042</p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" /> ncprincipal.pabna@gmail.com</p>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[
              ["/", "Home"],
              ["/about", "About"],
              ["/academics", "Academics"],
              ["/admission", "Admission"],
              ["/notice-board", "Notice Board"],
              ["/contact", "Contact"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="opacity-90 hover:opacity-100 hover:text-gold transition">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gold mb-3">Affiliations</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li>Bangladesh Nursing & Midwifery Council (BNMC)</li>
            <li>Directorate General of Nursing & Midwifery (DGNM)</li>
            <li>250-bed General Hospital, Pabna</li>
            <li>Ministry of Health & Family Welfare</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="container-pnc py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs opacity-80">
          <p>© {new Date().getFullYear()} Pabna Nursing College. All rights reserved.</p>
          <p>Government Nursing Education Institution · Pabna, Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}
