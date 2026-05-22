// Security headers applied to every response.
// CSP is intentionally permissive enough to support: TanStack Start SSR
// (inline hydration script), Tailwind/inline styles, Google Fonts,
// Supabase REST + Realtime, Supabase Storage images, Facebook OG images.

const SUPABASE_HTTPS = "https://*.supabase.co";
const SUPABASE_WSS = "wss://*.supabase.co";
const GOOGLE_FONTS_CSS = "https://fonts.googleapis.com";
const GOOGLE_FONTS_FILES = "https://fonts.gstatic.com";
const STORAGE_IMG = "https://storage.googleapis.com";
const LOVABLE_HOSTS = "https://*.lovable.app";

// Single-line CSP — workers expect a single header value.
const CSP = [
  "default-src 'self'",
  // 'unsafe-inline' for hydration; 'unsafe-eval' kept off.
  `script-src 'self' 'unsafe-inline' ${LOVABLE_HOSTS}`,
  `style-src 'self' 'unsafe-inline' ${GOOGLE_FONTS_CSS}`,
  `font-src 'self' data: ${GOOGLE_FONTS_FILES}`,
  `img-src 'self' data: blob: https: ${SUPABASE_HTTPS} ${STORAGE_IMG} ${LOVABLE_HOSTS}`,
  `connect-src 'self' ${SUPABASE_HTTPS} ${SUPABASE_WSS} ${LOVABLE_HOSTS}`,
  "media-src 'self' data: blob: https:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'self' https://www.facebook.com https://www.youtube.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const PERMISSIONS_POLICY = [
  "accelerometer=()",
  "camera=()",
  "geolocation=()",
  "gyroscope=()",
  "magnetometer=()",
  "microphone=()",
  "payment=()",
  "usb=()",
  "interest-cohort=()",
].join(", ");

const STATIC_HEADERS: Record<string, string> = {
  // Force HTTPS for 2 years + apply to subdomains + preload-list eligible
  "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
  // Block MIME sniffing
  "x-content-type-options": "nosniff",
  // Legacy clickjacking guard (frame-ancestors covers modern browsers)
  "x-frame-options": "DENY",
  // Don't leak full referrer cross-origin
  "referrer-policy": "strict-origin-when-cross-origin",
  // Lock down powerful browser features by default
  "permissions-policy": PERMISSIONS_POLICY,
  // Same-origin window references only
  "cross-origin-opener-policy": "same-origin",
  // Block FLoC / topics tracking opt-in
  "x-permitted-cross-domain-policies": "none",
};

// CSP is only meaningful for HTML responses; applying it to JSON/JS/images
// is harmless but Permissions-Policy on non-HTML is noise. We add CSP to all
// responses (cheap, defense-in-depth) and rely on the browser to scope it.
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

  for (const [k, v] of Object.entries(STATIC_HEADERS)) {
    if (!headers.has(k)) headers.set(k, v);
  }
  if (!headers.has("content-security-policy")) {
    headers.set("content-security-policy", CSP);
  }

  return response;
}
