import { queryOptions } from "@tanstack/react-query";
import type { ListingQuery } from "@/lib/listings/types";
import { createHttpApi } from "./http-adapter";
import { sampleApi } from "./sample-adapter";
import type { RentalsApi } from "./types";

const baseUrl = import.meta.env["VITE_BIZRENT_API_URL"] as string | undefined;

/** Uses the live API when VITE_BIZRENT_API_URL is set, otherwise prototype sample data. */
export const api: RentalsApi = baseUrl ? createHttpApi(baseUrl) : sampleApi;
export const usingSampleData = !baseUrl;

export const listingKeys = {
  search: (q: ListingQuery) => ["listings", "search", q] as const,
  detail: (id: string) => ["listings", "detail", id] as const,
  featured: (n: number) => ["listings", "featured", n] as const,
  byIds: (ids: string[]) => ["listings", "byIds", ids] as const,
  myRequests: (userId: string) => ["requests", userId] as const,
};

export const searchListingsQuery = (q: ListingQuery) =>
  queryOptions({ queryKey: listingKeys.search(q), queryFn: () => api.searchListings(q) });

export const listingQuery = (id: string) =>
  queryOptions({ queryKey: listingKeys.detail(id), queryFn: () => api.getListing(id) });

export const featuredListingsQuery = (n: number) =>
  queryOptions({ queryKey: listingKeys.featured(n), queryFn: () => api.getFeaturedListings(n) });

export type * from "./types";
