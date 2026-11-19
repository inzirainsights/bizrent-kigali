import type { Listing, ListingQuery, ListingSearchResult } from "@/lib/listings/types";

export type RequestStatus = "sent" | "pending" | "confirmed" | "declined";
export type TimeSlot = "morning" | "afternoon" | "late";

export interface EnquiryInput {
  listingId: string;
  name: string;
  phone: string; // E.164 +250…
  message: string;
}

export interface ViewingInput {
  listingId: string;
  name: string;
  phone: string;
  preferredDate: string; // ISO date
  preferredTime: TimeSlot;
  note?: string | undefined;
}

export interface RenterRequest {
  id: string;
  kind: "enquiry" | "viewing";
  listingId: string;
  listingTitle: string;
  createdAt: string; // ISO datetime
  /** Viewings start as "pending" and only become "confirmed" when the landlord confirms. */
  status: RequestStatus;
  preferredDate?: string;
  preferredTime?: TimeSlot;
}

/**
 * The contract the UI depends on. Swap the sample adapter for the HTTP adapter
 * (set VITE_BIZRENT_API_URL) without touching any component.
 */
export interface RentalsApi {
  searchListings(query: ListingQuery): Promise<ListingSearchResult>;
  getListing(id: string): Promise<Listing | null>;
  getFeaturedListings(limit: number): Promise<Listing[]>;
  getListingsByIds(ids: string[]): Promise<Listing[]>;
  sendEnquiry(input: EnquiryInput): Promise<RenterRequest>;
  requestViewing(input: ViewingInput): Promise<RenterRequest>;
  listMyRequests(): Promise<RenterRequest[]>;
}
