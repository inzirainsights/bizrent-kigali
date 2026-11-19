import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import type { Lang } from "@/lib/i18n/en";

/** Deterministic thousands grouping so server and browser render identically. */
export function groupDigits(n: number, lang: Lang = "en"): string {
  const sep = lang === "fr" ? "\u202f" : ",";
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

export function formatRwf(n: number, lang: Lang = "en"): string {
  return `RWF ${groupDigits(n, lang)}`;
}

/** Short price for map markers: 450k, 1.2M. */
export function formatRwfCompact(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${Number.isInteger(m) ? m : m.toFixed(1)}M`;
  }
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return String(n);
}

export function formatDate(iso: string, lang: Lang = "en"): string {
  return format(parseISO(iso), "d MMM yyyy", lang === "fr" ? { locale: fr } : undefined);
}
