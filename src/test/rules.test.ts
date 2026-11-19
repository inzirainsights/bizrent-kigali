import { describe, expect, it } from "vitest";
import { normalizeRwPhone, formatRwPhone } from "@/lib/phone";
import { matchesQuery, sortListings, cleanQuery } from "@/lib/listings/query";
import { searchToQuery } from "@/lib/listings/search-params";
import { validateViewing } from "@/lib/requests";
import { formatRwf } from "@/lib/format";
import { SAMPLE_LISTINGS } from "@/data/sample/listings";
import type { Listing } from "@/lib/listings/types";

const base: Listing = {
  id: "t1",
  isSample: true,
  title: "Test",
  category: "residential",
  propertyType: "apartment",
  areaId: "kimihurura",
  location: null,
  rentMonthlyRwf: 500000,
  availability: { status: "available_now" },
  bedrooms: 2,
  bathrooms: 1,
  amenities: [],
  description: "",
  photos: [],
  verifications: [],
  listedAt: "2026-11-01",
};

describe("+250 phone numbers", () => {
  it("accepts common Rwandan formats", () => {
    expect(normalizeRwPhone("0788123456")).toBe("+250788123456");
    expect(normalizeRwPhone("788 123 456")).toBe("+250788123456");
    expect(normalizeRwPhone("+250 788 123 456")).toBe("+250788123456");
  });
  it("rejects numbers that are not 9 digits after +250", () => {
    expect(normalizeRwPhone("78812345")).toBeNull();
    expect(normalizeRwPhone("+254712345678")).toBeNull();
  });
  it("formats for display", () => {
    expect(formatRwPhone("+250788123456")).toBe("+250 788 123 456");
  });
});

describe("prices in RWF", () => {
  it("formats monthly rent with RWF prefix", () => {
    expect(formatRwf(1200000)).toBe("RWF 1,200,000");
  });
});

describe("search rules", () => {
  it("hides listings that are not available", () => {
    expect(matchesQuery({ ...base, availability: { status: "unavailable" } }, {})).toBe(false);
  });
  it("applies the monthly rent range", () => {
    expect(matchesQuery(base, { minRent: 600000 })).toBe(false);
    expect(matchesQuery(base, { maxRent: 400000 })).toBe(false);
    expect(matchesQuery(base, { minRent: 400000, maxRent: 600000 })).toBe(true);
  });
  it("'within 30 days' excludes places available later than 30 days", () => {
    const today = new Date("2026-11-19T00:00:00Z");
    const later = { ...base, availability: { status: "available_from" as const, availableFrom: "2027-01-05" } };
    const soon = { ...base, availability: { status: "available_from" as const, availableFrom: "2026-12-01" } };
    expect(matchesQuery(later, { availability: "30days" }, today)).toBe(false);
    expect(matchesQuery(soon, { availability: "30days" }, today)).toBe(true);
  });
  it("drops bedroom filters for commercial searches and floor area for residential", () => {
    expect(cleanQuery({ category: "commercial", beds: 2, minSqm: 50 })).toEqual({ category: "commercial", minSqm: 50 });
    expect(cleanQuery({ category: "residential", beds: 2, minSqm: 50 })).toEqual({ category: "residential", beds: 2 });
  });
  it("sorts by lowest and highest rent", () => {
    const sorted = sortListings(SAMPLE_LISTINGS, "rent_asc");
    expect(sorted[0]!.rentMonthlyRwf).toBeLessThanOrEqual(sorted[1]!.rentMonthlyRwf);
    expect(sortListings(SAMPLE_LISTINGS, "rent_desc")[0]!.rentMonthlyRwf).toBe(3200000);
  });
  it("derives category from property type in the URL", () => {
    expect(searchToQuery({ type: "office", category: "residential" }).category).toBe("commercial");
  });
});

describe("sample data stays labelled", () => {
  it("every sample listing is flagged as sample", () => {
    expect(SAMPLE_LISTINGS.every((l) => l.isSample)).toBe(true);
  });
  it("no short-stay pricing: all rents are monthly amounts of at least RWF 50,000", () => {
    expect(SAMPLE_LISTINGS.every((l) => l.rentMonthlyRwf >= 50000)).toBe(true);
  });
});

describe("viewing requests", () => {
  it("rejects a preferred date in the past", () => {
    const now = new Date(2026, 10, 19);
    const r = validateViewing({ name: "Aline", phone: "0788123456", date: "2026-11-18", time: "morning" }, now);
    expect(r.errors.date).toBe("form.errDate");
    const ok = validateViewing({ name: "Aline", phone: "0788123456", date: "2026-11-19", time: "morning" }, now);
    expect(ok.errors).toEqual({});
  });
});
