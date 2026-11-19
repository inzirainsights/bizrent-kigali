import type { TFunction } from "@/lib/i18n";
import { areaName } from "./taxonomy";
import type { ListingQuery } from "./types";

/** "Apartments for rent in Kimihurura", "Commercial spaces for rent in Kigali", … */
export function resultsHeading(q: ListingQuery, t: TFunction): string {
  const what = q.type
    ? t(`typePlural.${q.type}`)
    : q.category === "residential"
      ? t("common.homes")
      : q.category === "commercial"
        ? t("common.spaces")
        : t("common.places");
  const where = areaName(q.area) ?? t("common.kigali");
  return t("results.heading", { what, where });
}
