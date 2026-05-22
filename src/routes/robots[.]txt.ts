import { createFileRoute } from "@tanstack/react-router";

const BASE_URL = "https://pncpab.lovable.app";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const body = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /login

Sitemap: ${BASE_URL}/sitemap.xml
`;
        return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
      },
    },
  },
});
