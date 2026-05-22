import constitution from "@/data/constitution.json";

export type Chapter = { num: string; title: string; body: string };
export type ConstitutionData = { preamble: string; chapters: Chapter[] };

export function getConstitutionData(): ConstitutionData {
  return constitution as ConstitutionData;
}

export function verifyPasscode(input: string): boolean {
  const expected = process.env.CONSTITUTION_PASSCODE;
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}
