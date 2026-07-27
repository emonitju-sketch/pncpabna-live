# MCP integration tests

Verifies every MCP tool advertised by `src/lib/mcp/index.ts` before a release.

## What is checked

- **Manifest sanity** — the 6 tools stay registered under their stable names and OAuth auth stays enabled. Catches accidental removals/renames.
- **Auth gate** — each tool refuses an unauthenticated caller.
- **Live Supabase** (optional) — invokes each read tool against the real database using a real user access token, and asserts the response shape / RLS behaviour.
- **Deadline logic** — `register_nagorik_songlap_2026` refuses after the hardcoded deadline.

## Run

```bash
bun run test          # all tests once
bun run test:watch    # watch mode while developing
```

The manifest, auth-gate, and deadline suites always run. The **Live Supabase** suite is skipped automatically when the environment variables below are missing, so the base command works in CI without any secrets.

## Enable the live suite (per developer / CI)

Create `tests/.env.test` (git-ignored) with a real signed-in user's access token:

```env
TEST_USER_ACCESS_TOKEN=<supabase access_token JWT>
TEST_USER_ID=<uuid of that user>
TEST_USER_EMAIL=<email of that user>
```

### How to obtain a token quickly

1. Sign in to `https://pncpabna.live` in your browser as a test user.
2. Open DevTools → Application → Local Storage → `sb-<project-ref>-auth-token`.
3. Copy `access_token`, `user.id`, and `user.email` from that JSON.
4. Paste them into `tests/.env.test`.

Access tokens expire in ~1 hour. Refresh by signing in again and copying the new token.

> Note: a raw `signInWithPassword` session JWT is fine for these tests because the handlers are invoked directly with a mocked `ToolContext`. When testing the OAuth-protected `/mcp` HTTP endpoint end-to-end you'd instead need a token minted through the OAuth flow (see `chat/mcp-guide` for the connection steps).

## Adding a new tool

1. Add the tool file under `src/lib/mcp/tools/`.
2. Register it in `src/lib/mcp/index.ts`.
3. Add the tool name to the manifest assertion in `tests/mcp/tools.test.ts`.
4. Add an "auth gate" case for it.
5. Add a live-Supabase assertion if it reads or writes data.
6. Run `bun run test`.
