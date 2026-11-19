import { ClientOnly, Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { lazy, Suspense, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ListingFacts } from "@/components/listings/ListingFacts";
import { formatRwf } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { mapConfig } from "@/lib/map-config";
import { areaName } from "@/lib/listings/taxonomy";
import type { Listing } from "@/lib/listings/types";
import { MapPlaceholder } from "./MapPlaceholder";

const LeafletMap = lazy(() => import("./LeafletMap"));

export function ListingsMap({
  listings,
  selectedId,
  onSelect,
  highlightId,
}: {
  listings: Listing[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  highlightId?: string | null;
}) {
  const { t, lang } = useI18n();
  const [failed, setFailed] = useState(false);
  const missing = useMemo(() => listings.filter((l) => !l.location).length, [listings]);
  const selected = listings.find((l) => l.id === selectedId);

  if (!mapConfig || failed) return <MapPlaceholder />;

  return (
    <div className="relative h-full w-full">
      <ClientOnly fallback={<Skeleton className="h-full w-full rounded-none" />}>
        <Suspense fallback={<Skeleton className="h-full w-full rounded-none" />}>
          <LeafletMap
            listings={listings}
            activeId={selectedId ?? highlightId}
            onSelect={onSelect}
            onUnavailable={() => setFailed(true)}
            label={t("map.label")}
          />
        </Suspense>
      </ClientOnly>

      {missing > 0 && (
        <p className="absolute left-14 right-3 top-3 z-[500] rounded-lg bg-card/95 px-3 py-2 text-xs text-muted-foreground shadow-card sm:right-auto sm:max-w-xs">
          {t("map.noLocation", { n: missing })}
        </p>
      )}

      {selected && (
        <div className="absolute inset-x-3 bottom-20 z-[500] mx-auto max-w-sm lg:bottom-3">
          <div className="relative flex gap-3 overflow-hidden rounded-xl border bg-card p-2 shadow-card">
            {selected.photos[0] && (
              <img src={selected.photos[0].src} alt="" className="size-24 shrink-0 rounded-lg object-cover" loading="lazy" />
            )}
            <div className="min-w-0 flex-1 py-1 pr-8">
              <p className="font-semibold">
                {formatRwf(selected.rentMonthlyRwf, lang)}
                <span className="text-xs font-normal text-muted-foreground"> {t("common.perMonth")}</span>
              </p>
              <Link
                to="/listings/$id"
                params={{ id: selected.id }}
                className="line-clamp-1 text-sm font-medium after:absolute after:inset-0 after:content-['']"
              >
                {selected.title}
              </Link>
              <p className="text-xs text-muted-foreground">
                {areaName(selected.areaId)} · {t(`type.${selected.propertyType}`)}
              </p>
              <ListingFacts listing={selected} className="mt-1 text-xs" />
            </div>
            <button
              type="button"
              onClick={() => onSelect(null)}
              className="absolute right-1.5 top-1.5 z-10 grid size-8 place-items-center rounded-full hover:bg-muted"
              aria-label={t("common.close")}
            >
              <X className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function LocationMap({ listing }: { listing: Listing }) {
  const { t } = useI18n();
  const [failed, setFailed] = useState(false);
  if (!listing.location) return <MapPlaceholder body={t("map.notShared")} />;
  if (!mapConfig || failed) return <MapPlaceholder />;
  return (
    <ClientOnly fallback={<Skeleton className="h-full w-full rounded-none" />}>
      <Suspense fallback={<Skeleton className="h-full w-full rounded-none" />}>
        <LeafletMap listings={[listing]} single onUnavailable={() => setFailed(true)} label={t("detail.location")} />
      </Suspense>
    </ClientOnly>
  );
}
