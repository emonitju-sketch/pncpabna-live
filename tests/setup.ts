import { config } from "dotenv";

// Load .env for VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY, and
// tests/.env.test for TEST_USER_ACCESS_TOKEN / TEST_USER_ID / TEST_USER_EMAIL.
config({ path: ".env" });
config({ path: "tests/.env.test", override: false });

// The MCP tool helper reads process.env.SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY
// (production runtime names). Mirror the VITE_* values so unit tests match prod.
process.env.SUPABASE_URL ||= process.env.VITE_SUPABASE_URL || "";
process.env.SUPABASE_PUBLISHABLE_KEY ||= process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
