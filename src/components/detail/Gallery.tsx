import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { ListingPhoto } from "@/lib/listings/types";
import { cn } from "@/lib/utils";

export function Gallery({ photos }: { photos: ListingPhoto[] }) {
  const { t } = useI18n();
  const [i, setI] = useState(0);
  if (photos.length === 0) return <div className="aspect-[4/3] rounded-xl bg-muted" />;
  const photo = photos[i] ?? photos[0]!;
  const go = (d: number) => setI((x) => (x + d + photos.length) % photos.length);

  return (
    <section aria-label={t("detail.photos")}>
      <div className="relative overflow-hidden rounded-xl bg-muted">
        <img
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          className="aspect-[4/3] w-full object-cover sm:aspect-[16/10]"
          fetchPriority={i === 0 ? "high" : undefined}
        />
        {photos.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label={t("detail.prev")} className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-card/95 shadow-card hover:bg-card">
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button type="button" onClick={() => go(1)} aria-label={t("detail.next")} className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-card/95 shadow-card hover:bg-card">
              <ChevronRight className="size-5" aria-hidden />
            </button>
            <p className="absolute bottom-3 right-3 rounded-full bg-card/95 px-2.5 py-1 text-xs font-medium" aria-live="polite">
              {t("detail.photoOf", { n: i + 1, total: photos.length })}
            </p>
          </>
        )}
      </div>
      {photos.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {photos.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setI(idx)}
              aria-label={t("detail.photoOf", { n: idx + 1, total: photos.length })}
              aria-current={idx === i}
              className={cn("shrink-0 overflow-hidden rounded-lg border-2", idx === i ? "border-primary" : "border-transparent opacity-80 hover:opacity-100")}
            >
              <img src={p.src} alt="" loading="lazy" className="h-14 w-20 object-cover" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
