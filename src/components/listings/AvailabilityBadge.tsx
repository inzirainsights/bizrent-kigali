import { CalendarClock, CircleCheck } from "lucide-react";
import { formatDate } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import type { Listing } from "@/lib/listings/types";
import { cn } from "@/lib/utils";

export function AvailabilityBadge({ availability, className }: { availability: Listing["availability"]; className?: string }) {
  const { t, lang } = useI18n();
  if (availability.status === "available_now") {
    return (
      <span className={cn("inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground", className)}>
        <CircleCheck className="size-3.5" aria-hidden />
        {t("availability.now")}
      </span>
    );
  }
  if (availability.status === "available_from" && availability.availableFrom) {
    return (
      <span className={cn("inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground", className)}>
        <CalendarClock className="size-3.5" aria-hidden />
        {t("availability.from", { date: formatDate(availability.availableFrom, lang) })}
      </span>
    );
  }
  return (
    <span className={cn("inline-flex rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground", className)}>
      {t("availability.unavailable")}
    </span>
  );
}

export function LastConfirmed({ date, className }: { date?: string | undefined; className?: string }) {
  const { t, lang } = useI18n();
  if (!date) return null;
  return <p className={cn("text-xs text-muted-foreground", className)}>{t("availability.confirmed", { date: formatDate(date, lang) })}</p>;
}
