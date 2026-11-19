import { Globe } from "lucide-react";
import { LANGUAGES, useI18n, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <label className={cn("relative inline-flex items-center", className)}>
      <span className="sr-only">{t("lang.label")}</span>
      <Globe className="pointer-events-none absolute left-2.5 size-4 text-muted-foreground" aria-hidden />
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value as Lang)}
        className="h-9 cursor-pointer appearance-none rounded-md border border-transparent bg-transparent pl-8 pr-2 text-sm font-medium text-foreground hover:bg-muted focus:border-ring"
      >
        {LANGUAGES.map((l) => (
          <option key={l.id} value={l.id}>
            {l.label}
          </option>
        ))}
      </select>
    </label>
  );
}
