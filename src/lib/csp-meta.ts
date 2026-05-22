// Meta-tag CSP fallback for prerendered HTML. The Lovable edge serves cached
// HTML and strips response headers set in `src/server.ts`, so we embed CSP
// in the document itself. Browsers honor meta-CSP for the directives below.
// NOTE: `frame-ancestors` is IGNORED in meta — it stays in security-headers.ts
// (delivered as a real header) and X-Frame-Options: DENY covers legacy browsers.

const SUPABASE_HTTPS = "https://*.supabase.co";
const SUPABASE_WSS = "wss://*.supabase.co";
const GOOGLE_FONTS_CSS = "https://fonts.googleapis.com";
const GOOGLE_FONTS_FILES = "https://fonts.gstatic.com";

export const META_CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${SUPABASE_HTTPS}`,
  `style-src 'self' 'unsafe-inline' ${GOOGLE_FONTS_CSS}`,
  `font-src 'self' ${GOOGLE_FONTS_FILES}`,
  "img-src 'self' data: blob: https:",
  `connect-src 'self' ${SUPABASE_HTTPS} ${SUPABASE_WSS}`,
].join("; ");
