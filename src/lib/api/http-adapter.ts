import type { ListingQuery } from "@/lib/listings/types";
import type { RentalsApi } from "./types";

/**
 * HTTP adapter for the shared BizRent API. Expected endpoints (adjust to the real API):
 *   GET  /listings?category=&area=&type=&minRent=&...&sort=   -> { items, total }
 *   GET  /listings/:id                                        -> Listing | 404
 *   GET  /listings/featured?limit=                            -> Listing[]
 *   GET  /listings?ids=a,b,c                                  -> { items }
 *   POST /enquiries        { listingId, name, phone, message } -> RenterRequest
 *   POST /viewing-requests { listingId, name, phone, preferredDate, preferredTime, note }
 *   GET  /me/requests                                          -> RenterRequest[]
 */
export function createHttpApi(baseUrl: string, getToken?: () => string | null): RentalsApi {
  async function call<T>(path: string, init?: RequestInit): Promise<T> {
    const token = getToken?.();
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return res.json() as Promise<T>;
  }

  function toParams(q: ListingQuery) {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(q)) {
      if (v == null || v === "") continue;
      sp.set(k, Array.isArray(v) ? v.join(",") : String(v));
    }
    return sp.toString();
  }

  return {
    searchListings: (q) => call(`/listings?${toParams(q)}`),
    async getListing(id) {
      try {
        return await call(`/listings/${encodeURIComponent(id)}`);
      } catch (e) {
        if (e instanceof Error && e.message.includes("404")) return null;
        throw e;
      }
    },
    getFeaturedListings: (limit) => call(`/listings/featured?limit=${limit}`),
    getListingsByIds: async (ids) =>
      ids.length ? (await call<{ items: never[] }>(`/listings?ids=${ids.join(",")}`)).items : [],
    sendEnquiry: (input) => call(`/enquiries`, { method: "POST", body: JSON.stringify(input) }),
    requestViewing: (input) => call(`/viewing-requests`, { method: "POST", body: JSON.stringify(input) }),
    listMyRequests: () => call(`/me/requests`),
  };
}
