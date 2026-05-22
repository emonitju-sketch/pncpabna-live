// Meta-tag CSP fallback. The Lovable edge serves prerendered HTML and strips
// custom response headers from `src/server.ts`, so we also embed CSP in the
// document itself. Browsers honor meta-CSP for the directives below.
// NOTE: `frame-ancestors`, `report-uri`, and `sandbox` are IGNORED in meta —
// those remain in `security-headers.ts` for SSR/non-cached responses.

const SUPABASE_HTTPS = "https://*.supabase.co";
const SUPABASE_WSS = "wss://*.supabase.co";
const GOOGLE_FONTS_CSS = "https://fonts.googleapis.com";
const GOOGLE_FONTS_FILES = "https://fonts.gstatic.com";
const STORAGE_IMG = "https://storage.googleapis.com";
const LOVABLE_HOSTS = "https://*.lovable.app";

export const META_CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${LOVABLE_HOSTS}`,
  `style-src 'self' 'unsafe-inline' ${GOOGLE_FONTS_CSS}`,
  `font-src 'self' data: ${GOOGLE_FONTS_FILES}`,
  `img-src 'self' data: blob: https: ${SUPABASE_HTTPS} ${STORAGE_IMG} ${LOVABLE_HOSTS}`,
  `connect-src 'self' ${SUPABASE_HTTPS} ${SUPABASE_WSS} ${LOVABLE_HOSTS}`,
  "media-src 'self' data: blob: https:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-src 'self' https://www.facebook.com https://www.youtube.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");
