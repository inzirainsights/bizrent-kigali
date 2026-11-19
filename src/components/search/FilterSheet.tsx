import { SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { Segmented } from "@/components/common/Segmented";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useI18n } from "@/lib/i18n";
import { AREAS, amenitiesFor, typesFor, categoryOf } from "@/lib/listings/taxonomy";
import type { AvailabilityFilter, Category, ListingQuery, PropertyType } from "@/lib/listings/types";
import { cn } from "@/lib/utils";
import { countActiveFilters } from "./ActiveFilters";
import { RentSelect } from "./RentSelect";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b py-5 last:border-0">
      <legend className="mb-3 text-[0.9375rem] font-semibold">{title}</legend>
      {children}
    </fieldset>
  );
}

function CountPicker({ value, onChange, label }: { value?: number | undefined; onChange: (v?: number) => void; label: string }) {
  const { t } = useI18n();
  const opts = [undefined, 1, 2, 3, 4];
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {opts.map((o) => (
        <button
          key={o ?? "any"}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          className={cn(
            "h-10 min-w-14 rounded-full border px-4 text-sm font-medium",
            value === o ? "border-primary bg-accent text-accent-foreground" : "bg-card hover:bg-muted",
          )}
        >
          {o == null ? t("filters.any") : `${o}+`}
        </button>
      ))}
    </div>
  );
}

function Check({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[0.9375rem]">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-5 accent-primary" />
      {label}
    </label>
  );
}

export function FilterSheet({ query, onApply }: { query: ListingQuery; onApply: (q: ListingQuery) => void }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<ListingQuery>(query);
  const active = countActiveFilters(query);

  useEffect(() => {
    if (open) setDraft(query);
  }, [open, query]);

  const set = <K extends keyof ListingQuery>(k: K, v: ListingQuery[K]) => setDraft((d) => ({ ...d, [k]: v }));
  const cat = draft.category;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="h-10">
          <SlidersHorizontal aria-hidden />
          {t("results.filters")}
          {active > 0 && (
            <span className="grid size-5 place-items-center rounded-full bg-primary text-xs text-primary-foreground">{active}</span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-5 py-4">
          <SheetTitle>{t("filters.title")}</SheetTitle>
          <SheetDescription className="sr-only">{t("results.filters")}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5">
          <Section title={t("filters.category")}>
            <Segmented<"all" | Category>
              label={t("filters.category")}
              value={cat ?? "all"}
              onChange={(v) => {
                const c = v === "all" ? undefined : v;
                setDraft((d) => ({ ...d, category: c, type: d.type && c && categoryOf(d.type) !== c ? undefined : d.type }));
              }}
              options={[
                { value: "all", label: t("filters.all") },
                { value: "residential", label: t("common.residential") },
                { value: "commercial", label: t("common.commercial") },
              ]}
              className="flex w-full"
            />
          </Section>

          <Section title={t("common.area")}>
            <label htmlFor="f-area" className="sr-only">{t("common.area")}</label>
            <select id="f-area" className="field" value={draft.area ?? ""} onChange={(e) => set("area", e.target.value || undefined)}>
              <option value="">{t("common.anyArea")}</option>
              {AREAS.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </Section>

          <Section title={t("common.propertyType")}>
            <label htmlFor="f-type" className="sr-only">{t("common.propertyType")}</label>
            <select
              id="f-type"
              className="field"
              value={draft.type ?? ""}
              onChange={(e) => {
                const ty = (e.target.value || undefined) as PropertyType | undefined;
                setDraft((d) => ({ ...d, type: ty, category: ty ? categoryOf(ty) : d.category }));
              }}
            >
              <option value="">{t("common.anyType")}</option>
              {typesFor(cat).map((ty) => <option key={ty.id} value={ty.id}>{t(`type.${ty.id}`)}</option>)}
            </select>
          </Section>

          <Section title={t("filters.rent")}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="f-min" className="mb-1.5 block text-sm text-muted-foreground">{t("common.minRent")}</label>
                <RentSelect id="f-min" value={draft.minRent} onChange={(v) => set("minRent", v)} emptyLabel={t("common.noMin")} />
              </div>
              <div>
                <label htmlFor="f-max" className="mb-1.5 block text-sm text-muted-foreground">{t("common.maxRent")}</label>
                <RentSelect id="f-max" value={draft.maxRent} onChange={(v) => set("maxRent", v)} emptyLabel={t("common.noMax")} />
              </div>
            </div>
          </Section>

          {cat !== "commercial" && (
            <>
              <Section title={t("filters.bedrooms")}>
                <CountPicker label={t("filters.bedrooms")} value={draft.beds} onChange={(v) => set("beds", v)} />
              </Section>
              <Section title={t("filters.bathrooms")}>
                <CountPicker label={t("filters.bathrooms")} value={draft.baths} onChange={(v) => set("baths", v)} />
              </Section>
            </>
          )}

          {cat === "commercial" && (
            <Section title={t("filters.floorArea")}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="f-minsqm" className="mb-1.5 block text-sm text-muted-foreground">{t("filters.minSqm")}</label>
                  <input id="f-minsqm" className="field" inputMode="numeric" type="number" min={0} value={draft.minSqm ?? ""} onChange={(e) => set("minSqm", e.target.value ? Number(e.target.value) : undefined)} />
                </div>
                <div>
                  <label htmlFor="f-maxsqm" className="mb-1.5 block text-sm text-muted-foreground">{t("filters.maxSqm")}</label>
                  <input id="f-maxsqm" className="field" inputMode="numeric" type="number" min={0} value={draft.maxSqm ?? ""} onChange={(e) => set("maxSqm", e.target.value ? Number(e.target.value) : undefined)} />
                </div>
              </div>
            </Section>
          )}

          <Section title={t("filters.features")}>
            {cat !== "commercial" && <Check label={t("filters.furnished")} checked={!!draft.furnished} onChange={(v) => set("furnished", v || undefined)} />}
            <Check label={t("filters.parking")} checked={!!draft.parking} onChange={(v) => set("parking", v || undefined)} />
          </Section>

          <Section title={t("filters.amenities")}>
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-4">
              {amenitiesFor(cat).map((a) => (
                <Check
                  key={a.id}
                  label={t(a.labelKey)}
                  checked={!!draft.amenities?.includes(a.id)}
                  onChange={(v) =>
                    set("amenities", v ? [...(draft.amenities ?? []), a.id] : draft.amenities?.filter((x) => x !== a.id))
                  }
                />
              ))}
            </div>
          </Section>

          <Section title={t("filters.availability")}>
            <div className="flex flex-col">
              {(
                [
                  ["any", t("filters.availableAny")],
                  ["now", t("filters.availableNow")],
                  ["30days", t("filters.available30")],
                ] as [AvailabilityFilter, string][]
              ).map(([v, label]) => (
                <label key={v} className="flex min-h-11 cursor-pointer items-center gap-3 text-[0.9375rem]">
                  <input
                    type="radio"
                    name="availability"
                    checked={(draft.availability ?? "any") === v}
                    onChange={() => set("availability", v === "any" ? undefined : v)}
                    className="size-5 accent-primary"
                  />
                  {label}
                </label>
              ))}
            </div>
          </Section>
        </div>

        <div className="flex gap-3 border-t bg-card px-5 py-4">
          <Button variant="outline" className="flex-1" onClick={() => setDraft({ sort: query.sort })}>
            {t("results.clearAll")}
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              onApply(draft);
              setOpen(false);
            }}
          >
            {t("results.showResults")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
