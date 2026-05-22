import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getConstitutionData, verifyPasscode } from "./constitution.server";

export const unlockConstitution = createServerFn({ method: "POST" })
  .inputValidator((input) =>
    z.object({ passcode: z.string().min(1).max(128) }).parse(input),
  )
  .handler(async ({ data }) => {
    if (!verifyPasscode(data.passcode)) {
      return { ok: false as const };
    }
    return { ok: true as const, data: getConstitutionData() };
  });
