import { SAMPLE_LISTINGS } from "@/data/sample/listings";
import { matchesQuery, sortListings } from "@/lib/listings/query";
import type { RentalsApi, RenterRequest } from "./types";

const REQUESTS_KEY = "bizrent.sample.requests";
const isBrowser = typeof window !== "undefined";

/** Simulated network latency in the browser so loading states are visible. */
function delay(ms = 450) {
  return isBrowser ? new Promise((r) => setTimeout(r, ms)) : Promise.resolve();
}

function ensureOnline() {
  if (isBrowser && navigator.onLine === false) {
    throw new Error("You appear to be offline.");
  }
}

function readRequests(): RenterRequest[] {
  if (!isBrowser) return [];
  try {
    return JSON.parse(localStorage.getItem(REQUESTS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveRequest(r: RenterRequest) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify([r, ...readRequests()]));
}

function titleOf(id: string) {
  return SAMPLE_LISTINGS.find((l) => l.id === id)?.title ?? "Listing";
}

export const sampleApi: RentalsApi = {
  async searchListings(query) {
    await delay();
    ensureOnline();
    const items = sortListings(
      SAMPLE_LISTINGS.filter((l) => matchesQuery(l, query)),
      query.sort,
    );
    return { items, total: items.length };
  },
  async getListing(id) {
    await delay(250);
    return SAMPLE_LISTINGS.find((l) => l.id === id) ?? null;
  },
  async getFeaturedListings(limit) {
    await delay(250);
    return sortListings(
      SAMPLE_LISTINGS.filter((l) => l.availability.status === "available_now"),
      "newest",
    ).slice(0, limit);
  },
  async getListingsByIds(ids) {
    await delay(250);
    return SAMPLE_LISTINGS.filter((l) => ids.includes(l.id));
  },
  async sendEnquiry(input) {
    await delay(700);
    ensureOnline();
    const r: RenterRequest = {
      id: crypto.randomUUID(),
      kind: "enquiry",
      listingId: input.listingId,
      listingTitle: titleOf(input.listingId),
      createdAt: new Date().toISOString(),
      status: "sent",
    };
    saveRequest(r);
    return r;
  },
  async requestViewing(input) {
    await delay(700);
    ensureOnline();
    const r: RenterRequest = {
      id: crypto.randomUUID(),
      kind: "viewing",
      listingId: input.listingId,
      listingTitle: titleOf(input.listingId),
      createdAt: new Date().toISOString(),
      status: "pending",
      preferredDate: input.preferredDate,
      preferredTime: input.preferredTime,
    };
    saveRequest(r);
    return r;
  },
  async listMyRequests() {
    await delay(300);
    return readRequests();
  },
};
