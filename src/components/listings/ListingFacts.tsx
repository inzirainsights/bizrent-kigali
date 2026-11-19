import { BedDouble, Bath, Ruler, Sofa, Car } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import type { Listing } from "@/lib/listings/types";
import { cn } from "@/lib/utils";

/** Key attributes, chosen by category: bedrooms/bathrooms for homes, floor area for commercial. */
export function ListingFacts({ listing, className }: { listing: Listing; className?: string }) {
  const { t } = useI18n();
  const facts: { icon: typeof Ruler; label: string }[] = [];
  if (listing.category === "residential") {
    if (listing.bedrooms != null)
      facts.push({ icon: BedDouble, label: t(listing.bedrooms === 1 ? "listing.beds" : "listing.bedsMany", { n: listing.bedrooms }) });
    if (listing.bathrooms != null)
      facts.push({ icon: Bath, label: t(listing.bathrooms === 1 ? "listing.baths" : "listing.bathsMany", { n: listing.bathrooms }) });
    if (listing.furnished) facts.push({ icon: Sofa, label: t("listing.furnished") });
  } else {
    if (listing.floorAreaSqm != null) facts.push({ icon: Ruler, label: t("listing.sqm", { n: listing.floorAreaSqm }) });
  }
  if (listing.parking) facts.push({ icon: Car, label: t("listing.parking") });

  return (
    <ul className={cn("flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground", className)}>
      {facts.map((f) => (
        <li key={f.label} className="inline-flex items-center gap-1">
          <f.icon className="size-4" aria-hidden />
          {f.label}
        </li>
      ))}
    </ul>
  );
}
