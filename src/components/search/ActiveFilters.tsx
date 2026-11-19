import { X } from "lucide-react";
import { formatRwf } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { AMENITIES, areaName } from "@/lib/listings/taxonomy";
import type { ListingQuery } from "@/lib/listings/types";

type Chip = { key: string; label: string; remove: (q: ListingQuery) => ListingQuery };

export function ActiveFilters({ query, onChange }: { query: ListingQuery; onChange: (q: ListingQuery) => void }) {
  const { t, lang } = useI18n();
  const without = (k: keyof ListingQuery) => (q: ListingQuery) => ({ ...q, [k]: undefined });
  const chips: Chip[] = [];

  if (query.category && !query.type)
    chips.push({ key: "category", label: t(query.category === "residential" ? "common.residential" : "common.commercial"), remove: without("category") });
  if (query.type) chips.push({ key: "type", label: t(`type.${query.type}`), remove: without("type") });
  if (query.area) chips.push({ key: "area", label: areaName(query.area) ?? query.area, remove: without("area") });
  if (query.minRent) chips.push({ key: "minRent", label: t("chip.min", { amount: formatRwf(query.minRent, lang) }), remove: without("minRent") });
  if (query.maxRent) chips.push({ key: "maxRent", label: t("chip.max", { amount: formatRwf(query.maxRent, lang) }), remove: without("maxRent") });
  if (query.beds) chips.push({ key: "beds", label: t("chip.beds", { n: query.beds }), remove: without("beds") });
  if (query.baths) chips.push({ key: "baths", label: t("chip.baths", { n: query.baths }), remove: without("baths") });
  if (query.minSqm) chips.push({ key: "minSqm", label: t("chip.minSqm", { n: query.minSqm }), remove: without("minSqm") });
  if (query.maxSqm) chips.push({ key: "maxSqm", label: t("chip.maxSqm", { n: query.maxSqm }), remove: without("maxSqm") });
  if (query.furnished) chips.push({ key: "furnished", label: t("filters.furnished"), remove: without("furnished") });
  if (query.parking) chips.push({ key: "parking", label: t("filters.parking"), remove: without("parking") });
  for (const a of query.amenities ?? []) {
    const def = AMENITIES.find((x) => x.id === a);
    if (def)
      chips.push({ key: `am-${a}`, label: t(def.labelKey), remove: (q) => ({ ...q, amenities: q.amenities?.filter((x) => x !== a) }) });
  }
  if (query.availability === "now") chips.push({ key: "av", label: t("filters.availableNow"), remove: without("availability") });
  if (query.availability === "30days") chips.push({ key: "av", label: t("filters.available30"), remove: without("availability") });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label={t("results.activeFilters")}>
      {chips.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={() => onChange(c.remove(query))}
          className="inline-flex h-8 items-center gap-1 rounded-full border bg-card pl-3 pr-2 text-sm hover:bg-muted"
          aria-label={t("results.removeFilter", { label: c.label })}
        >
          {c.label}
          <X className="size-3.5 text-muted-foreground" aria-hidden />
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange({ sort: query.sort })}
        className="h-8 px-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        {t("results.clearAll")}
      </button>
    </div>
  );
}

export function countActiveFilters(q: ListingQuery) {
  const { sort: _sort, amenities, ...rest } = q;
  return Object.values(rest).filter((v) => v !== undefined && v !== false).length + (amenities?.length ?? 0);
}
