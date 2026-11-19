import { fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { AREAS, PROPERTY_TYPES, categoryOf } from "./taxonomy";
import type { AvailabilityFilter, Category, ListingQuery, PropertyType, SortOption } from "./types";

/** URL search params for /rent. Loose on input; normalised by `searchToQuery`. */
export const rentSearchSchema = z.object({
  category: fallback(z.string().optional(), undefined),
  area: fallback(z.string().optional(), undefined),
  type: fallback(z.string().optional(), undefined),
  minRent: fallback(z.number().optional(), undefined),
  maxRent: fallback(z.number().optional(), undefined),
  beds: fallback(z.number().optional(), undefined),
  baths: fallback(z.number().optional(), undefined),
  minSqm: fallback(z.number().optional(), undefined),
  maxSqm: fallback(z.number().optional(), undefined),
  furnished: fallback(z.boolean().optional(), undefined),
  parking: fallback(z.boolean().optional(), undefined),
  amenities: fallback(z.string().optional(), undefined),
  availability: fallback(z.string().optional(), undefined),
  sort: fallback(z.string().optional(), undefined),
  view: fallback(z.string().optional(), undefined),
});

export type RentSearch = z.infer<typeof rentSearchSchema>;

const CATEGORIES: Category[] = ["residential", "commercial"];
const SORTS: SortOption[] = ["newest", "rent_asc", "rent_desc"];
const AVAIL: AvailabilityFilter[] = ["any", "now", "30days"];

const pos = (n: number | undefined) => (n != null && Number.isFinite(n) && n > 0 ? Math.round(n) : undefined);

export function searchToQuery(s: RentSearch): ListingQuery {
  const type = PROPERTY_TYPES.some((t) => t.id === s.type) ? (s.type as PropertyType) : undefined;
  let category = CATEGORIES.includes(s.category as Category) ? (s.category as Category) : undefined;
  if (type) category = categoryOf(type);
  return {
    category,
    type,
    area: AREAS.some((a) => a.id === s.area) ? s.area : undefined,
    minRent: pos(s.minRent),
    maxRent: pos(s.maxRent),
    beds: pos(s.beds),
    baths: pos(s.baths),
    minSqm: pos(s.minSqm),
    maxSqm: pos(s.maxSqm),
    furnished: s.furnished || undefined,
    parking: s.parking || undefined,
    amenities: s.amenities ? s.amenities.split(",").filter(Boolean) : undefined,
    availability: AVAIL.includes(s.availability as AvailabilityFilter)
      ? (s.availability as AvailabilityFilter)
      : undefined,
    sort: SORTS.includes(s.sort as SortOption) ? (s.sort as SortOption) : undefined,
  };
}

export function queryToSearch(q: ListingQuery): RentSearch {
  return {
    ...q,
    amenities: q.amenities?.length ? q.amenities.join(",") : undefined,
  };
}
