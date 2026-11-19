import { formatRwf } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { RENT_PRESETS } from "@/lib/listings/taxonomy";

export function RentSelect({
  id,
  value,
  onChange,
  emptyLabel,
}: {
  id: string;
  value: number | undefined;
  onChange: (v: number | undefined) => void;
  emptyLabel: string;
}) {
  const { lang } = useI18n();
  const presets = value != null && !RENT_PRESETS.includes(value) ? [...RENT_PRESETS, value].sort((a, b) => a - b) : RENT_PRESETS;
  return (
    <select id={id} className="field" value={value ?? ""} onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}>
      <option value="">{emptyLabel}</option>
      {presets.map((p) => (
        <option key={p} value={p}>
          {formatRwf(p, lang)}
        </option>
      ))}
    </select>
  );
}
