/**
 * Map provider configuration. Defaults to OpenStreetMap tiles (no key needed).
 * Set VITE_MAP_PROVIDER=none to show the placeholder, or VITE_MAP_TILE_URL to use
 * another tile provider. Note: OSM's public tiles are for light use — point
 * VITE_MAP_TILE_URL at a commercial tile service before launch.
 */
const provider = (import.meta.env["VITE_MAP_PROVIDER"] as string | undefined) ?? "osm";

export const mapConfig =
  provider === "none"
    ? null
    : {
        tileUrl:
          (import.meta.env["VITE_MAP_TILE_URL"] as string | undefined) ??
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      };

export const KIGALI_CENTER = { lat: -1.9441, lng: 30.0819 };
