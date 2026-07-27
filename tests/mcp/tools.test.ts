import { describe, expect, it } from "vitest";
import whoami from "@/lib/mcp/tools/whoami";
import listActivities from "@/lib/mcp/tools/list-activities";
import listNotices from "@/lib/mcp/tools/list-notices";
import getNotice from "@/lib/mcp/tools/get-notice";
import listEvents from "@/lib/mcp/tools/list-events";
import registerNagorikSonglap from "@/lib/mcp/tools/register-nagorik-songlap";
import mcp from "@/lib/mcp/index";
import { REGISTRATION_DEADLINE } from "@/lib/nagorik-songlap";
import { extractText, mockCtx, parseJson, requireLiveAuth } from "./helpers";

// ---------------------------------------------------------------------------
// Manifest sanity — always runs; catches accidental tool removal or renames.
// ---------------------------------------------------------------------------
describe("MCP manifest", () => {
  it("registers exactly the 6 known tools", () => {
    const names = mcp.tools.map((t) => t.name).sort();
    expect(names).toEqual(
      [
        "get_notice",
        "list_activities",
        "list_events",
        "list_notices",
        "register_nagorik_songlap_2026",
        "whoami",
      ].sort(),
    );
  });

  it("enables OAuth issuer auth", () => {
    expect(mcp.auth).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// Auth gate — every tool must refuse an unauthenticated caller.
// ---------------------------------------------------------------------------
describe("Auth gate", () => {
  const ctx = mockCtx({ authenticated: false });
  const cases = [
    { name: "whoami", run: () => whoami.handler({}, ctx) },
    { name: "list_activities", run: () => listActivities.handler({}, ctx) },
    { name: "list_notices", run: () => listNotices.handler({}, ctx) },
    { name: "get_notice", run: () => getNotice.handler({ slug: "x" }, ctx) },
    { name: "list_events", run: () => listEvents.handler({}, ctx) },
    {
      name: "register_nagorik_songlap_2026",
      run: () =>
        registerNagorikSonglap.handler(
          { name: "Test User", phone: "+8801700000000" },
          ctx,
        ),
    },
  ];

  for (const c of cases) {
    it(`${c.name} rejects unauthenticated`, async () => {
      const res = await c.run();
      expect(res.isError).toBe(true);
      expect(extractText(res)).toMatch(/not authenticated/i);
    });
  }
});

// ---------------------------------------------------------------------------
// Live Supabase — skipped unless a real user access token is provided.
// ---------------------------------------------------------------------------
const live = requireLiveAuth();

describe.skipIf(live.skip)("Live tool calls (Supabase, RLS as user)", () => {
  const ctx = mockCtx();

  it("whoami returns the signed-in user_id and email", async () => {
    const res = await whoami.handler({}, ctx);
    expect(res.isError).toBeFalsy();
    const body = parseJson<{ user_id: string; email: string | null }>(extractText(res));
    expect(body?.user_id).toBe(process.env.TEST_USER_ID);
  });

  it("list_activities returns an array (structuredContent.activities)", async () => {
    const res = await listActivities.handler({ limit: 5 }, ctx);
    expect(res.isError).toBeFalsy();
    expect(Array.isArray((res as any).structuredContent?.activities)).toBe(true);
  });

  it("list_notices returns an array and respects limit", async () => {
    const res = await listNotices.handler({ limit: 3 }, ctx);
    expect(res.isError).toBeFalsy();
    const arr = (res as any).structuredContent?.notices as unknown[];
    expect(Array.isArray(arr)).toBe(true);
    expect(arr.length).toBeLessThanOrEqual(3);
  });

  it("list_events returns an array", async () => {
    const res = await listEvents.handler({ limit: 5 }, ctx);
    expect(res.isError).toBeFalsy();
    expect(Array.isArray((res as any).structuredContent?.events)).toBe(true);
  });

  it("get_notice returns 'not found' for a bogus slug", async () => {
    const res = await getNotice.handler(
      { slug: `__does_not_exist_${Date.now()}` },
      ctx,
    );
    expect(res.isError).toBe(true);
    expect(extractText(res)).toMatch(/not found/i);
  });

  it("get_notice returns a real notice when list_notices has any", async () => {
    const list = await listNotices.handler({ limit: 1 }, ctx);
    const notices = (list as any).structuredContent?.notices as Array<{ slug: string }>;
    if (!notices?.length) return; // no data — nothing to assert
    const res = await getNotice.handler({ slug: notices[0].slug }, ctx);
    expect(res.isError).toBeFalsy();
    expect((res as any).structuredContent?.notice?.slug).toBe(notices[0].slug);
  });
});

// ---------------------------------------------------------------------------
// Registration deadline logic — pure, always runs.
// ---------------------------------------------------------------------------
describe("register_nagorik_songlap_2026 deadline enforcement", () => {
  it("rejects registration after the deadline", async () => {
    const afterDeadline = new Date(REGISTRATION_DEADLINE.getTime() + 60_000);
    const originalNow = Date.now;
    Date.now = () => afterDeadline.getTime();
    // Also patch Date constructor for `new Date()` used inside isRegistrationOpen.
    const OriginalDate = Date;
    // @ts-expect-error test-only mock
    globalThis.Date = class extends OriginalDate {
      constructor(...args: unknown[]) {
        // @ts-expect-error spread
        super(...(args.length ? args : [afterDeadline.getTime()]));
      }
      static now() {
        return afterDeadline.getTime();
      }
    };
    try {
      const res = await registerNagorikSonglap.handler(
        { name: "Deadline Test", phone: "+8801700000000" },
        mockCtx({ email: "test@example.com" }),
      );
      expect(res.isError).toBe(true);
      expect(extractText(res)).toMatch(/সমাপ্ত|closed/i);
    } finally {
      globalThis.Date = OriginalDate;
      Date.now = originalNow;
    }
  });
});
