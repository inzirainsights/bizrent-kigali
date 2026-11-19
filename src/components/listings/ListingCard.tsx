import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRwf } from "@/lib/format";
import { useI18n } from "@/lib/i18n";
import { areaName } from "@/lib/listings/taxonomy";
import type { Listing } from "@/lib/listings/types";
import { cn } from "@/lib/utils";
import { AvailabilityBadge, LastConfirmed } from "./AvailabilityBadge";
import { ListingFacts } from "./ListingFacts";
import { SaveButton } from "./SaveButton";

export function ListingCard({
  listing,
  active,
  onHover,
  eager,
}: {
  listing: Listing;
  active?: boolean;
  onHover?: (id: string | null) => void;
  eager?: boolean;
}) {
  const { t, lang } = useI18n();
  const photo = listing.photos[0];
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-card",
        active && "ring-2 ring-primary",
      )}
      onMouseEnter={() => onHover?.(listing.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div className="relative aspect-[4/3] bg-muted">
        {photo && (
          <img
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <AvailabilityBadge availability={listing.availability} className="shadow-sm" />
        </div>
        <SaveButton listingId={listing.id} className="absolute right-3 top-3 z-10" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-lg font-semibold">
          {formatRwf(listing.rentMonthlyRwf, lang)}
          <span className="text-sm font-normal text-muted-foreground"> {t("common.perMonth")}</span>
        </p>
        <h3 className="font-medium leading-snug">
          <Link to="/listings/$id" params={{ id: listing.id }} className="after:absolute after:inset-0 after:content-['']">
            {listing.title}
          </Link>
        </h3>
        <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden />
          {areaName(listing.areaId)} · {t(`type.${listing.propertyType}`)}
        </p>
        <ListingFacts listing={listing} />
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
          <LastConfirmed date={listing.availability.lastConfirmedAt} />
          {listing.isSample && (
            <span className="rounded border border-dashed px-1.5 py-0.5 text-[0.6875rem] font-medium uppercase tracking-wide text-muted-foreground">
              {t("common.sample")}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card" aria-hidden>
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
