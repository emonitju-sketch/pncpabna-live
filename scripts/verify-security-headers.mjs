#!/usr/bin/env node
/**
 * Security-header smoke test.
 *
 * Probes every important subpath on the live site and asserts:
 *  - http://  → 301/308 to https://  (with HSTS on the redirect)
 *  - https:// page responses carry HSTS, X-Content-Type-Options, Referrer-Policy
 *  - prerendered HTML embeds a Content-Security-Policy <meta> tag
 *
 * Usage:  node scripts/verify-security-headers.mjs [origin]
 *   default origin: https://pncpabna.live
 *
 * Exits non-zero on any failure so it can gate CI.
 */

const ORIGIN = process.argv[2] || "https://pncpabna.live";
const HOST = new URL(ORIGIN).host;

const PATHS = [
  "/", "/activities", "/news", "/gallery", "/events",
  "/contact", "/constitution", "/admin", "/login",
  "/sitemap.xml", "/robots.txt",
];

const REQUIRED_HEADERS = [
  "strict-transport-security",
  "x-content-type-options",
  "referrer-policy",
];

const failures = [];

function ok(msg) { console.log(`  ✓ ${msg}`); }
function bad(msg) { console.log(`  ✗ ${msg}`); failures.push(msg); }

async function head(url, redirect = "manual") {
  const res = await fetch(url, { method: "GET", redirect });
  return res;
}

async function checkPath(p) {
  console.log(`\n[${p}]`);

  // 1. http → https redirect
  const httpUrl = `http://${HOST}${p}`;
  try {
    const r = await head(httpUrl);
    if (r.status === 301 || r.status === 308) {
      const loc = r.headers.get("location") || "";
      if (loc.startsWith("https://")) ok(`http→https redirect (${r.status})`);
      else bad(`http redirect Location not https: ${loc}`);
      if (r.headers.get("strict-transport-security")) ok("HSTS on redirect");
      else bad("HSTS missing on http redirect");
    } else {
      bad(`http response not a redirect (status ${r.status})`);
    }
  } catch (e) {
    bad(`http fetch failed: ${e.message}`);
  }

  // 2. https response headers
  const httpsUrl = `${ORIGIN}${p}`;
  let res;
  try {
    res = await head(httpsUrl, "follow");
  } catch (e) {
    bad(`https fetch failed: ${e.message}`);
    return;
  }
  for (const h of REQUIRED_HEADERS) {
    if (res.headers.get(h)) ok(`header ${h}`);
    else bad(`missing header ${h}`);
  }

  // 3. CSP — header OR meta in HTML
  const cspHeader = res.headers.get("content-security-policy");
  if (cspHeader) {
    ok("CSP via response header");
  } else {
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("text/html")) {
      const html = await res.text();
      if (/<meta[^>]+http-equiv=["']?Content-Security-Policy["']?/i.test(html)) {
        ok("CSP via <meta> tag");
      } else {
        bad("CSP missing (no header, no meta)");
      }
    } else {
      ok(`CSP n/a for ${ct || "non-html"}`);
    }
  }
}

console.log(`Verifying security headers on ${ORIGIN}`);
for (const p of PATHS) {
  // eslint-disable-next-line no-await-in-loop
  await checkPath(p);
}

console.log("\n" + "=".repeat(50));
if (failures.length === 0) {
  console.log(`✅ All ${PATHS.length} routes passed.`);
  process.exit(0);
} else {
  console.log(`❌ ${failures.length} failure(s):`);
  for (const f of failures) console.log(`   - ${f}`);
  process.exit(1);
}
