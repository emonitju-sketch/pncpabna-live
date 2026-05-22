// Balanced security headers for a non-profit community site.
// Strategy: apply protection to ALL routes, but only attach the heavier
// CSP to HTML responses where it actually matters. JSON / JS / CSS / images
// get the lightweight transport + sniffing guards only — this avoids noisy
// CSP violations on asset responses and keeps future debugging simple.

const SUPABASE_HTTPS = "https://*.supabase.co";
const SUPABASE_WSS = "wss://*.supabase.co";
const GOOGLE_FONTS_CSS = "https://fonts.googleapis.com";
const GOOGLE_FONTS_FILES = "https://fonts.gstatic.com";

// Practical CSP — covers Supabase REST + Realtime, Google Fonts, inline
// hydration scripts/styles, and public images. Intentionally NOT ultra-strict.
const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${SUPABASE_HTTPS}`,
  `style-src 'self' 'unsafe-inline' ${GOOGLE_FONTS_CSS}`,
  `font-src 'self' ${GOOGLE_FONTS_FILES}`,
  "img-src 'self' data: blob: https:",
  `connect-src 'self' ${SUPABASE_HTTPS} ${SUPABASE_WSS}`,
  "frame-ancestors 'none'",
].join("; ");

// Applied to EVERY response (HTML, JSON, assets) — cheap, universally safe.
const BASE_HEADERS: Record<string, string> = {
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
};

function isHtmlResponse(response: Response): boolean {
  const ct = response.headers.get("content-type") || "";
  return ct.includes("text/html");
}

export function applySecurityHeaders(response: Response): Response {
  // Some upstream Responses are immutable — clone if so.
  let headers: Headers;
  try {
    headers = response.headers;
    headers.set("__probe__", "1");
    headers.delete("__probe__");
  } catch {
    const cloned = new Response(response.body, response);
    headers = cloned.headers;
    response = cloned;
  }

  for (const [k, v] of Object.entries(BASE_HEADERS)) {
    if (!headers.has(k)) headers.set(k, v);
  }

  // Only attach CSP to HTML — JSON/assets don't benefit and noisy violations
  // make real issues harder to spot.
  if (isHtmlResponse(response) && !headers.has("content-security-policy")) {
    headers.set("content-security-policy", CSP);
  }

  return response;
}
