import type { Category, PropertyType } from "./types";
import type { MessageKey } from "@/lib/i18n/en";

/** Kigali neighbourhoods available at launch. Replace with API reference data later. */
export const AREAS: { id: string; name: string; district: string }[] = [
  { id: "kimihurura", name: "Kimihurura", district: "Gasabo" },
  { id: "kacyiru", name: "Kacyiru", district: "Gasabo" },
  { id: "nyarutarama", name: "Nyarutarama", district: "Gasabo" },
  { id: "kibagabaga", name: "Kibagabaga", district: "Gasabo" },
  { id: "kimironko", name: "Kimironko", district: "Gasabo" },
  { id: "remera", name: "Remera", district: "Gasabo" },
  { id: "gisozi", name: "Gisozi", district: "Gasabo" },
  { id: "city-centre", name: "City Centre", district: "Nyarugenge" },
  { id: "kiyovu", name: "Kiyovu", district: "Nyarugenge" },
  { id: "nyamirambo", name: "Nyamirambo", district: "Nyarugenge" },
  { id: "kicukiro", name: "Kicukiro", district: "Kicukiro" },
  { id: "gikondo", name: "Gikondo", district: "Kicukiro" },
];

export function areaName(id: string | undefined): string | undefined {
  return AREAS.find((a) => a.id === id)?.name;
}

export const PROPERTY_TYPES: { id: PropertyType; category: Category }[] = [
  { id: "apartment", category: "residential" },
  { id: "house", category: "residential" },
  { id: "studio", category: "residential" },
  { id: "room", category: "residential" },
  { id: "office", category: "commercial" },
  { id: "shop", category: "commercial" },
  { id: "warehouse", category: "commercial" },
];

export function typesFor(category?: Category) {
  return category ? PROPERTY_TYPES.filter((t) => t.category === category) : PROPERTY_TYPES;
}

export function categoryOf(type: PropertyType): Category {
  return PROPERTY_TYPES.find((t) => t.id === type)!.category;
}

export const AMENITIES: { id: string; labelKey: MessageKey; categories: Category[] }[] = [
  { id: "water_tank", labelKey: "amenity.water_tank", categories: ["residential", "commercial"] },
  { id: "backup_power", labelKey: "amenity.backup_power", categories: ["residential", "commercial"] },
  { id: "security", labelKey: "amenity.security", categories: ["residential", "commercial"] },
  { id: "internet", labelKey: "amenity.internet", categories: ["residential", "commercial"] },
  { id: "garden", labelKey: "amenity.garden", categories: ["residential"] },
  { id: "balcony", labelKey: "amenity.balcony", categories: ["residential"] },
  { id: "lift", labelKey: "amenity.lift", categories: ["residential", "commercial"] },
  { id: "loading_bay", labelKey: "amenity.loading_bay", categories: ["commercial"] },
  { id: "street_frontage", labelKey: "amenity.street_frontage", categories: ["commercial"] },
];

export function amenitiesFor(category?: Category) {
  return category ? AMENITIES.filter((a) => a.categories.includes(category)) : AMENITIES;
}

/** Rent presets for quick selection (RWF / month). */
export const RENT_PRESETS = [100000, 200000, 300000, 500000, 750000, 1000000, 1500000, 2000000, 3000000];
