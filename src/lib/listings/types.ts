/**
 * Listing domain types. These mirror the shape the shared BizRent API is expected to
 * return. Visual components only read these types — they never decide business rules.
 */
export type Category = "residential" | "commercial";

export type PropertyType = "apartment" | "house" | "studio" | "room" | "office" | "shop" | "warehouse";

export type AvailabilityStatus = "available_now" | "available_from" | "unavailable";

export interface ListingPhoto {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

/** Public map location. `null` when the landlord has not shared one — never invent it. */
export interface PublicLocation {
  lat: number;
  lng: number;
  /** "approximate" = neighbourhood-level only; the map shows an area, not a pin. */
  precision: "exact" | "approximate";
}

export interface RecurringCost {
  label: string;
  amountRwf: number;
}

/** A specific check with a date. Shown only when supplied — never a generic "verified" badge. */
export interface VerificationCheck {
  label: string;
  checkedAt: string; // ISO date
}

export interface Listing {
  id: string;
  /** True for prototype data. Sample listings must never be presented as real. */
  isSample: boolean;
  title: string;
  category: Category;
  propertyType: PropertyType;
  areaId: string;
  /** Street/landmark text the landlord made public, e.g. "Off KG 9 Ave". */
  publicAddress?: string;
  location: PublicLocation | null;
  rentMonthlyRwf: number;
  depositRwf?: number;
  depositNote?: string;
  serviceChargeMonthlyRwf?: number;
  recurringCosts?: RecurringCost[];
  availability: {
    status: AvailabilityStatus;
    availableFrom?: string; // ISO date
    lastConfirmedAt?: string; // ISO date
  };
  bedrooms?: number;
  bathrooms?: number;
  floorAreaSqm?: number;
  permittedUse?: string[];
  access?: string[];
  furnished?: boolean;
  parking?: boolean;
  amenities: string[];
  description: string;
  photos: ListingPhoto[];
  verifications: VerificationCheck[];
  /** Only present when the landlord intentionally chose to show contact details. */
  publicContact?: { name?: string; phone?: string };
  listedAt: string; // ISO date
}

export type SortOption = "newest" | "rent_asc" | "rent_desc";
export type AvailabilityFilter = "any" | "now" | "30days";

/** Normalised search query — the contract between the URL, the UI and the API. */
export interface ListingQuery {
  category?: Category | undefined;
  area?: string | undefined;
  type?: PropertyType | undefined;
  minRent?: number | undefined;
  maxRent?: number | undefined;
  beds?: number | undefined;
  baths?: number | undefined;
  minSqm?: number | undefined;
  maxSqm?: number | undefined;
  furnished?: boolean | undefined;
  parking?: boolean | undefined;
  amenities?: string[] | undefined;
  availability?: AvailabilityFilter | undefined;
  sort?: SortOption | undefined;
}

export interface ListingSearchResult {
  items: Listing[];
  total: number;
}
