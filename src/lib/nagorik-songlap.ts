// Single source of truth for নাগরিক সংলাপ ২০২৬ event constants.
export const EVENT_SLUG = "nagorik-songlap-2026";
export const EVENT_PATH = "/nagorik-songlap-2026";
export const POPUP_KEY = "pnc:nagorik-songlap-2026";

// Registration closes 26 June 2026, 23:30 Bangladesh time (UTC+6).
export const REGISTRATION_DEADLINE = new Date("2026-06-26T23:30:00+06:00");

// Event start: 27 June 2026 (Asia/Dhaka).
export const EVENT_START_ISO = "2026-06-27T10:00:00+06:00";

export function isRegistrationOpen(now: Date = new Date()): boolean {
  return now < REGISTRATION_DEADLINE;
}

export const EVENT_NAME_BN = "নাগরিক সংলাপ ২০২৬";
export const EVENT_DESCRIPTION_BN =
  "পাবনা নাগরিক কমিটির উন্মুক্ত নাগরিক সংলাপ — সকল পাবনাবাসীর জন্য উন্মুক্ত। অংশগ্রহণ করতে আজই নিবন্ধন করুন।";
export const CLOSED_MESSAGE_BN = "নিবন্ধন কার্যক্রম সমাপ্ত হয়েছে।";
