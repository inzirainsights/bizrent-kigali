import type { Listing, ListingQuery } from "./types";

/**
 * Reference implementation of search rules, used by the sample adapter only.
 * The real API applies these on the server; components never call this directly.
 */
export function matchesQuery(l: Listing, q: ListingQuery, today: Date = new Date()): boolean {
  if (l.availability.status === "unavailable") return false;
  if (q.category && l.category !== q.category) return false;
  if (q.area && l.areaId !== q.area) return false;
  if (q.type && l.propertyType !== q.type) return false;
  if (q.minRent != null && l.rentMonthlyRwf < q.minRent) return false;
  if (q.maxRent != null && l.rentMonthlyRwf > q.maxRent) return false;
  if (q.beds != null && (l.bedrooms ?? 0) < q.beds) return false;
  if (q.baths != null && (l.bathrooms ?? 0) < q.baths) return false;
  if (q.minSqm != null && (l.floorAreaSqm ?? 0) < q.minSqm) return false;
  if (q.maxSqm != null && (l.floorAreaSqm ?? Infinity) > q.maxSqm) return false;
  if (q.furnished && !l.furnished) return false;
  if (q.parking && !l.parking) return false;
  if (q.amenities?.length && !q.amenities.every((a) => l.amenities.includes(a))) return false;
  if (q.availability === "now" && l.availability.status !== "available_now") return false;
  if (q.availability === "30days" && l.availability.status === "available_from") {
    const from = new Date(l.availability.availableFrom ?? "");
    const limit = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    if (!(from <= limit)) return false;
  }
  return true;
}

export function sortListings(items: Listing[], sort: ListingQuery["sort"] = "newest"): Listing[] {
  const copy = [...items];
  if (sort === "rent_asc") copy.sort((a, b) => a.rentMonthlyRwf - b.rentMonthlyRwf);
  else if (sort === "rent_desc") copy.sort((a, b) => b.rentMonthlyRwf - a.rentMonthlyRwf);
  else copy.sort((a, b) => b.listedAt.localeCompare(a.listedAt));
  return copy;
}

/** Remove filters that don't apply to the chosen category (e.g. bedrooms for offices). */
export function cleanQuery(q: ListingQuery): ListingQuery {
  const out: ListingQuery = { ...q };
  if (out.category === "commercial") {
    delete out.beds;
    delete out.baths;
    delete out.furnished;
  }
  if (out.category === "residential") {
    delete out.minSqm;
    delete out.maxSqm;
  }
  if (out.amenities && out.amenities.length === 0) delete out.amenities;
  if (out.availability === "any") delete out.availability;
  if (out.sort === "newest") delete out.sort;
  for (const k of Object.keys(out) as (keyof ListingQuery)[]) {
    if (out[k] === undefined || out[k] === false || out[k] === "") delete out[k];
  }
  return out;
}
