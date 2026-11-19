import { Heart } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useSaved } from "@/lib/saved";
import { cn } from "@/lib/utils";

export function SaveButton({ listingId, variant = "overlay", className }: { listingId: string; variant?: "overlay" | "inline"; className?: string }) {
  const { isSaved, toggle } = useSaved();
  const { t } = useI18n();
  const saved = isSaved(listingId);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(listingId);
      }}
      aria-pressed={saved}
      aria-label={saved ? t("common.removeSaved") : t("common.saveListing")}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors",
        variant === "overlay"
          ? "size-10 bg-card/95 text-foreground shadow-card hover:bg-card"
          : "h-11 border border-input bg-card px-4 text-[0.9375rem] hover:bg-muted",
        className,
      )}
    >
      <Heart className={cn("size-5", saved && "fill-primary text-primary")} aria-hidden />
      {variant === "inline" && <span>{saved ? t("common.saved") : t("common.save")}</span>}
    </button>
  );
}
