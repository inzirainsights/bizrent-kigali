import { MapPinned } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function MapPlaceholder({ className, body }: { className?: string; body?: string }) {
  const { t } = useI18n();
  return (
    <div className={cn("flex h-full w-full flex-col items-center justify-center gap-2 bg-muted p-6 text-center", className)}>
      <MapPinned className="size-7 text-muted-foreground" aria-hidden />
      <p className="font-medium">{t("map.placeholderTitle")}</p>
      <p className="max-w-xs text-sm text-muted-foreground">{body ?? t("map.placeholderBody")}</p>
    </div>
  );
}
