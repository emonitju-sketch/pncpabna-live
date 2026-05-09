import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Facebook } from "lucide-react";
import logo from "@/assets/pnc-logo.png";

export function Footer() {
  return (
    <footer className="mt-20 bg-primary text-primary-foreground">
      <div className="container-pnc py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" width={48} height={48} className="h-12 w-12 bg-white rounded-full p-1" />
            <div>
              <div className="font-display text-lg font-bold">পাবনা নাগরিক কমিটি - পিএনসি</div>
              <div className="text-xs opacity-90">নাগরিক ঐক্যেই বদলাবে পাবনা।</div>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm opacity-90">
            পাবনার উন্নয়ন, সামাজিক সচেতনতা, নাগরিক অধিকার এবং মানবিক উদ্যোগে আমরা একসাথে কাজ করি।
          </p>
          <div className="mt-6 space-y-2 text-sm">
            <p className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /> পাবনা সদর, পাবনা, বাংলাদেশ</p>
            <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> +৮৮০ ১৭১৬-৮০৮০৭৪</p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4" /><span>pnc.pabna@outlook.com</span></p>
            <a href="https://www.facebook.com/pncpabna/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-2 text-sm hover:underline">
              <Facebook className="h-4 w-4" /> facebook.com/pncpabna
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">দ্রুত লিংক</h4>
          <ul className="space-y-2 text-sm">
            {[
              ["/", "হোম"],
              ["/about", "আমাদের সম্পর্কে"],
              ["/activities", "কার্যক্রম"],
              ["/news", "সংবাদ"],
              ["/membership", "সদস্য হোন"],
              ["/contact", "যোগাযোগ"],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="opacity-90 hover:opacity-100 hover:underline transition">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">আমাদের লক্ষ্য</h4>
          <ul className="space-y-2 text-sm opacity-90">
            <li>নাগরিক ঐক্য ও অংশগ্রহণ</li>
            <li>সামাজিক সচেতনতা</li>
            <li>জনস্বার্থে কার্যক্রম</li>
            <li>পাবনার উন্নয়ন</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="container-pnc py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs opacity-90">
          <p>© ২০২৬ পাবনা নাগরিক কমিটি - পিএনসি | সর্বস্বত্ব সংরক্ষিত</p>
          <p>একটি নাগরিকভিত্তিক সামাজিক সংগঠন · পাবনা, বাংলাদেশ</p>
        </div>
      </div>
    </footer>
  );
}
