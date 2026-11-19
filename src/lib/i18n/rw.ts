import type { MessageKey } from "./en";

/**
 * Kinyarwanda — DRAFT, a few navigation strings only. Needs review by a native
 * speaker before launch. Missing keys fall back to English.
 */
export const rw: Partial<Record<MessageKey, string>> = {
  "nav.rent": "Gukodesha",
  "nav.signIn": "Injira",
  "nav.signOut": "Sohoka",
  "lang.label": "Ururimi",
  "common.search": "Shakisha",
  "common.perMonth": "/ ukwezi",
  "results.map": "Ikarita",
};
