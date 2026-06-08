import { createFileRoute } from "@tanstack/react-router";

const BASE_URL = "https://pncpabna.live";
const ROUTES = ["/", "/about", "/council", "/activities", "/notices", "/events", "/gallery", "/reports", "/constitution", "/membership", "/contact", "/nagorik-songlap-2026"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().split("T")[0];
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map((r) => `  <url><loc>${BASE_URL}${r}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${r === "/" ? "1.0" : "0.8"}</priority></url>`).join("\n")}
</urlset>`;
        return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
      },
    },
  },
});
