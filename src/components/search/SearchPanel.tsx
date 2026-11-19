import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Segmented } from "@/components/common/Segmented";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { cleanQuery } from "@/lib/listings/query";
import { queryToSearch } from "@/lib/listings/search-params";
import { AREAS, typesFor } from "@/lib/listings/taxonomy";
import type { Category, PropertyType } from "@/lib/listings/types";
import { RentSelect } from "./RentSelect";

export function SearchPanel() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category>("residential");
  const [area, setArea] = useState("");
  const [type, setType] = useState<PropertyType | "">("");
  const [minRent, setMinRent] = useState<number>();
  const [maxRent, setMaxRent] = useState<number>();

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = cleanQuery({
      category,
      area: area || undefined,
      type: type || undefined,
      minRent,
      maxRent: maxRent != null && minRent != null && maxRent < minRent ? undefined : maxRent,
    });
    navigate({ to: "/rent", search: queryToSearch(q) });
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border bg-card p-4 shadow-card sm:p-6" aria-label={t("common.search")}>
      <Segmented
        label={t("common.lookingFor")}
        value={category}
        onChange={(c) => {
          setCategory(c);
          setType("");
        }}
        options={[
          { value: "residential", label: t("common.residential") },
          { value: "commercial", label: t("common.commercial") },
        ]}
        className="mb-4 flex w-full sm:w-auto"
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_0.8fr_0.8fr_auto] lg:items-end">
        <div>
          <label htmlFor="sp-area" className="mb-1.5 block text-sm font-medium">{t("common.area")}</label>
          <select id="sp-area" className="field" value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">{t("common.anyArea")}</option>
            {AREAS.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sp-type" className="mb-1.5 block text-sm font-medium">{t("common.propertyType")}</label>
          <select id="sp-type" className="field" value={type} onChange={(e) => setType(e.target.value as PropertyType | "")}>
            <option value="">{t("common.anyType")}</option>
            {typesFor(category).map((ty) => (
              <option key={ty.id} value={ty.id}>{t(`type.${ty.id}`)}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:col-span-2 lg:col-span-2">
          <div>
            <label htmlFor="sp-min" className="mb-1.5 block text-sm font-medium">{t("common.minRent")}</label>
            <RentSelect id="sp-min" value={minRent} onChange={setMinRent} emptyLabel={t("common.noMin")} />
          </div>
          <div>
            <label htmlFor="sp-max" className="mb-1.5 block text-sm font-medium">{t("common.maxRent")}</label>
            <RentSelect id="sp-max" value={maxRent} onChange={setMaxRent} emptyLabel={t("common.noMax")} />
          </div>
        </div>
        <Button type="submit" size="lg" className="w-full sm:col-span-2 lg:col-span-1 lg:w-auto">
          <Search aria-hidden /> {t("common.search")}
        </Button>
      </div>
    </form>
  );
}
