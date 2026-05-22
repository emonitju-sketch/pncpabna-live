import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "@/components/ui/sonner";
import { PreviewDiagnostics } from "@/components/dev/PreviewDiagnostics";
import { META_CSP } from "@/lib/csp-meta";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-primary">৪০৪</h1>
        <h2 className="mt-4 text-xl font-semibold">পাতাটি খুঁজে পাওয়া যায়নি</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          আপনি যে পাতাটি খুঁজছেন সেটি আর নেই অথবা সরিয়ে ফেলা হয়েছে।
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            হোমে ফিরে যান
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">পাতাটি লোড করা যায়নি</h1>
        <p className="mt-2 text-sm text-muted-foreground">কিছু একটা সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            আবার চেষ্টা করুন
          </button>
          <a href="/" className="rounded-md border border-input px-4 py-2 text-sm">হোম</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PNC Pabna — পাবনা নাগরিক কমিটি" },
      {
        name: "description",
        content:
          "পাবনা নাগরিক কমিটি - পিএনসি একটি নাগরিকভিত্তিক সামাজিক সংগঠন, যা পাবনার উন্নয়ন, সামাজিক সচেতনতা, নাগরিক অধিকার এবং মানবিক উদ্যোগে কাজ করে।",
      },
      { name: "keywords", content: "পাবনা নাগরিক কমিটি, পিএনসি পাবনা, PNC Pabna, পাবনা সামাজিক সংগঠন, পাবনা উন্নয়ন, পাবনা নাগরিক উদ্যোগ" },
      { name: "author", content: "পাবনা নাগরিক কমিটি - পিএনসি" },
      { name: "theme-color", content: "#006A4E" },
      { httpEquiv: "Cache-Control", content: "no-cache, no-store, must-revalidate" },
      { httpEquiv: "Pragma", content: "no-cache" },
      { httpEquiv: "Expires", content: "0" },
      { property: "og:title", content: "PNC Pabna — পাবনা নাগরিক কমিটি" },
      { property: "og:description", content: "নাগরিক ঐক্যেই বদলাবে পাবনা: পাবনার উন্নয়ন, সামাজিক সচেতনতা, নাগরিক অধিকার এবং মানবিক উদ্যোগে আমরা একসাথে কাজ করি।" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "PNC Pabna" },
      { property: "og:locale", content: "bn_BD" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PNC Pabna — পাবনা নাগরিক কমিটি" },
      { name: "twitter:description", content: "নাগরিক ঐক্যেই বদলাবে পাবনা: পাবনার উন্নয়ন, সামাজিক সচেতনতা, নাগরিক অধিকার এবং মানবিক উদ্যোগে আমরা একসাথে কাজ করি।" },
      { name: "description", content: "নাগরিক ঐক্যেই বদলাবে পাবনা: পাবনার উন্নয়ন, সামাজিক সচেতনতা, নাগরিক অধিকার এবং মানবিক উদ্যোগে আমরা একসাথে কাজ করি।" },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/273f3a7e-ed91-4e29-a20e-b6b87f85b19f" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/273f3a7e-ed91-4e29-a20e-b6b87f85b19f" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "NGO",
          name: "পাবনা নাগরিক কমিটি - পিএনসি",
          alternateName: "PNC Pabna",
          url: "https://pncpab.lovable.app",
          slogan: "নাগরিক ঐক্যেই বদলাবে পাবনা",
          sameAs: ["https://www.facebook.com/pncpabna/"],
          address: { "@type": "PostalAddress", addressLocality: "Pabna", addressCountry: "BD" },
          contactPoint: { "@type": "ContactPoint", telephone: "+8801716808074", email: "pnc.pabna@outlook.com", contactType: "customer service" },
        }),
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      // Preload the Google Fonts CSS so the swap happens earlier
      {
        rel: "preload",
        as: "style",
        href: "https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap",
      },
    ],

  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <Toaster richColors position="top-right" />
        {import.meta.env.DEV && <PreviewDiagnostics />}
      </div>
    </QueryClientProvider>
  );
}
