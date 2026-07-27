import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { REGISTRATION_DEADLINE } from "@/lib/nagorik-songlap";
import whoami from "@/lib/mcp/tools/whoami";
import listActivities from "@/lib/mcp/tools/list-activities";
import listNotices from "@/lib/mcp/tools/list-notices";
import getNotice from "@/lib/mcp/tools/get-notice";
import listEvents from "@/lib/mcp/tools/list-events";
import registerNagorikSonglap from "@/lib/mcp/tools/register-nagorik-songlap";
import { extractText, mockCtx } from "./helpers";

/**
 * MCP Auth Matrix
 * ---------------
 * The transport-level bearer/cookie verifier lives in @lovable.dev/mcp-js —
 * these tests assert the *tool handler contract*: given a ToolContext derived
 * from that verifier, each tool consistently allows or denies. The context
 * scenarios below model the outcomes of the verifier:
 *
 *   - "unauthenticated"        → no valid bearer AND no session cookie
 *   - "bearer-oauth-client"    → OAuth bearer with a client_id claim (external client)
 *   - "bearer-oauth-no-email"  → OAuth bearer whose account has no email
 *   - "session-cookie-user"    → in-app browser session, no OAuth client_id
 *   - "role-admin" / "role-user" → same as session-user with a role claim
 *
 * Every tool is exercised against every scenario and matched against an
 * explicit `allow` / `deny` expectation.
 */

type Scenario = {
  id: string;
  label: string;
  ctx: ReturnType<typeof mockCtx>;
};

const SCENARIOS: Scenario[] = [
  {
    id: "unauthenticated",
    label: "no bearer, no session cookie",
    ctx: mockCtx({ authenticated: false, email: null, token: "", clientId: "" }),
  },
  {
    id: "bearer-oauth-client",
    label: "OAuth bearer with client_id + email",
    ctx: mockCtx({
      authenticated: true,
      userId: "user-oauth-1",
      email: "oauth-user@example.com",
      token: "bearer-oauth-token",
      clientId: "chatgpt-connector",
      claims: {
        sub: "user-oauth-1",
        email: "oauth-user@example.com",
        client_id: "chatgpt-connector",
        aud: "authenticated",
        role: "authenticated",
      },
    }),
  },
  {
    id: "bearer-oauth-no-email",
    label: "OAuth bearer, account has no email",
    ctx: mockCtx({
      authenticated: true,
      userId: "user-oauth-2",
      email: null,
      token: "bearer-oauth-token-2",
      clientId: "cursor",
      claims: {
        sub: "user-oauth-2",
        email: null,
        client_id: "cursor",
        role: "authenticated",
      },
    }),
  },
  {
    id: "session-cookie-user",
    label: "browser session cookie, no client_id",
    ctx: mockCtx({
      authenticated: true,
      userId: "user-session-1",
      email: "session-user@example.com",
      token: "session-jwt",
      clientId: "",
      claims: {
        sub: "user-session-1",
        email: "session-user@example.com",
        role: "authenticated",
      },
    }),
  },
  {
    id: "role-user",
    label: "authenticated + app role=user",
    ctx: mockCtx({
      authenticated: true,
      userId: "user-role-user",
      email: "user@example.com",
      token: "tok",
      clientId: "claude",
      claims: {
        sub: "user-role-user",
        email: "user@example.com",
        client_id: "claude",
        app_role: "user",
      },
    }),
  },
  {
    id: "role-admin",
    label: "authenticated + app role=admin",
    ctx: mockCtx({
      authenticated: true,
      userId: "user-role-admin",
      email: "admin@example.com",
      token: "tok",
      clientId: "claude",
      claims: {
        sub: "user-role-admin",
        email: "admin@example.com",
        client_id: "claude",
        app_role: "admin",
      },
    }),
  },
];

type Expect = "allow" | "deny";
type ToolSpec = {
  name: string;
  run: (ctx: ReturnType<typeof mockCtx>) => Promise<any>;
  /** id → expected outcome. Missing = "allow". */
  expectations: Partial<Record<string, Expect>>;
  /**
   * Optional matcher for the deny message so we don't accept a wrong denial
   * (e.g. a live-network error) as "correctly denied".
   */
  denyMatch?: Partial<Record<string, RegExp>>;
};

const TOOLS: ToolSpec[] = [
  {
    name: "whoami",
    run: (ctx) => whoami.handler({}, ctx),
    expectations: { unauthenticated: "deny" },
    denyMatch: { unauthenticated: /not authenticated/i },
  },
  {
    name: "list_activities",
    run: (ctx) => listActivities.handler({ limit: 1 }, ctx),
    expectations: { unauthenticated: "deny" },
    denyMatch: { unauthenticated: /not authenticated/i },
  },
  {
    name: "list_notices",
    run: (ctx) => listNotices.handler({ limit: 1 }, ctx),
    expectations: { unauthenticated: "deny" },
    denyMatch: { unauthenticated: /not authenticated/i },
  },
  {
    name: "get_notice",
    run: (ctx) => getNotice.handler({ slug: "__nonexistent__" }, ctx),
    // Unauthenticated must be rejected on the auth gate BEFORE the DB call.
    // For authenticated callers we only assert the auth check passes — the
    // "not found" DB response is asserted in the live-tests suite.
    expectations: { unauthenticated: "deny" },
    denyMatch: { unauthenticated: /not authenticated/i },
  },
  {
    name: "list_events",
    run: (ctx) => listEvents.handler({ limit: 1 }, ctx),
    expectations: { unauthenticated: "deny" },
    denyMatch: { unauthenticated: /not authenticated/i },
  },
  {
    name: "register_nagorik_songlap_2026",
    run: (ctx) =>
      registerNagorikSonglap.handler(
        { name: "Matrix Test", phone: "+8801700000000" },
        ctx,
      ),
    // Register denies both unauthenticated AND authenticated-without-email —
    // it must write user_id + email to program_registrations.
    expectations: {
      unauthenticated: "deny",
      "bearer-oauth-no-email": "deny",
    },
    denyMatch: {
      unauthenticated: /not authenticated/i,
      "bearer-oauth-no-email": /no email/i,
    },
  },
];

// ---------------------------------------------------------------------------
// Matrix: tool × scenario → expected allow/deny at the auth gate
// ---------------------------------------------------------------------------
describe("MCP auth matrix", () => {
  // Freeze time to one day BEFORE the registration deadline so the register
  // tool exercises its auth branches (email presence) rather than short-
  // circuiting on the closed deadline once real time passes June 26 2026.
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(REGISTRATION_DEADLINE.getTime() - 24 * 60 * 60 * 1000));
  });
  afterAll(() => {
    vi.useRealTimers();
  });

  for (const tool of TOOLS) {
    describe(tool.name, () => {
      for (const scenario of SCENARIOS) {
        const expected: Expect = tool.expectations[scenario.id] ?? "allow";

        it(`${expected.toUpperCase()} — ${scenario.label}`, async () => {
          const res = await tool.run(scenario.ctx);
          const text = extractText(res);

          if (expected === "deny") {
            expect(
              res.isError,
              `${tool.name} should DENY "${scenario.label}" but returned ok`,
            ).toBe(true);
            const matcher = tool.denyMatch?.[scenario.id];
            if (matcher) {
              expect(
                text,
                `${tool.name} deny reason mismatch for "${scenario.label}"`,
              ).toMatch(matcher);
            }
            return;
          }

          // ALLOW: the auth gate must pass. Downstream Supabase may still
          // fail with a fetch/network error in unit-test env — that is NOT
          // an auth denial. Only fail this test if the tool refused with an
          // auth-shaped error.
          if (res.isError) {
            expect(
              text,
              `${tool.name} unexpectedly denied "${scenario.label}"`,
            ).not.toMatch(/not authenticated|no email/i);
          }
        });
      }
    });
  }
});

// ---------------------------------------------------------------------------
// Claim/role sanity — tools currently do not gate on app_role; document it.
// If we later add admin-only tools, extend the matrix rather than the tool.
// ---------------------------------------------------------------------------
describe("Role claims (informational)", () => {
  it("read tools treat role=user and role=admin identically at the auth gate", async () => {
    const userRes = await listNotices.handler(
      { limit: 1 },
      SCENARIOS.find((s) => s.id === "role-user")!.ctx,
    );
    const adminRes = await listNotices.handler(
      { limit: 1 },
      SCENARIOS.find((s) => s.id === "role-admin")!.ctx,
    );
    // Both must clear the auth gate. Any non-auth downstream error is fine.
    for (const res of [userRes, adminRes]) {
      if (res.isError) {
        expect(extractText(res)).not.toMatch(/not authenticated/i);
      }
    }
  });

  it("whoami surfaces the claim-derived user_id for OAuth client and session contexts", async () => {
    const oauth = SCENARIOS.find((s) => s.id === "bearer-oauth-client")!;
    const session = SCENARIOS.find((s) => s.id === "session-cookie-user")!;
    const a = await whoami.handler({}, oauth.ctx);
    const b = await whoami.handler({}, session.ctx);
    expect(a.isError).toBeFalsy();
    expect(b.isError).toBeFalsy();
    expect(extractText(a)).toContain("user-oauth-1");
    expect(extractText(b)).toContain("user-session-1");
  });
});
