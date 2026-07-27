import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listActivities from "./tools/list-activities";
import listNotices from "./tools/list-notices";
import getNotice from "./tools/get-notice";
import listEvents from "./tools/list-events";
import registerNagorikSonglap from "./tools/register-nagorik-songlap";
import whoAmI from "./tools/whoami";

// The OAuth issuer MUST be the direct Supabase host (not the .lovable.cloud proxy).
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "pnc-pabna-mcp",
  title: "পাবনা নাগরিক কমিটি (PNC)",
  version: "0.1.0",
  instructions:
    "Tools for the Pabna Nagorik Committee (PNC) civic website. Read activities, notices, and events; register for open civic dialogue programs on behalf of the signed-in user.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    whoAmI,
    listActivities,
    listNotices,
    getNotice,
    listEvents,
    registerNagorikSonglap,
  ],
});
