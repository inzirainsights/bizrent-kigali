/** Browser-only. Always load through React.lazy behind <ClientOnly>. */
import L from "leaflet";
import { useEffect, useRef } from "react";
import { formatRwfCompact } from "@/lib/format";
import { KIGALI_CENTER, mapConfig } from "@/lib/map-config";
import type { Listing } from "@/lib/listings/types";

export interface LeafletMapProps {
  listings: Listing[];
  activeId?: string | null | undefined;
  onSelect?: (id: string | null) => void;
  /** Single-listing mode: approximate locations render as an area circle, not a pin. */
  single?: boolean;
  onUnavailable?: () => void;
  label: string;
}

function fit(map: L.Map, bounds: L.LatLngExpression[], single: boolean) {
  if (bounds.length === 1) map.setView(bounds[0]!, single ? 15 : 14);
  else if (bounds.length > 1) map.fitBounds(L.latLngBounds(bounds), { padding: [48, 48], maxZoom: 15 });
}

export default function LeafletMap({ listings, activeId, onSelect, single, onUnavailable, label }: LeafletMapProps) {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const boundsRef = useRef<L.LatLngExpression[]>([]);
  const selectRef = useRef(onSelect);
  selectRef.current = onSelect;

  useEffect(() => {
    if (!el.current || !mapConfig) return;
    const map = L.map(el.current, {
      center: [KIGALI_CENTER.lat, KIGALI_CENTER.lng],
      zoom: 12,
      scrollWheelZoom: !single,
      attributionControl: true,
    });
    let errors = 0;
    L.tileLayer(mapConfig.tileUrl, { attribution: mapConfig.attribution, maxZoom: 18 })
      .on("tileerror", () => {
        errors += 1;
        if (errors === 8) onUnavailable?.();
      })
      .addTo(map);
    map.on("click", () => selectRef.current?.(null));
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    // The map may mount while hidden (mobile list view); refit once it gets a real size.
    let wasEmpty = el.current.clientWidth === 0;
    const ro = new ResizeObserver(() => {
      if (!el.current) return;
      map.invalidateSize();
      const empty = el.current.clientWidth === 0;
      if (wasEmpty && !empty) fit(map, boundsRef.current, !!single);
      wasEmpty = empty;
    });
    ro.observe(el.current);
    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    markersRef.current.clear();
    const located = listings.filter((l) => l.location);
    const bounds: L.LatLngExpression[] = [];

    for (const l of located) {
      const { lat, lng, precision } = l.location!;
      bounds.push([lat, lng]);
      if (single && precision === "approximate") {
        L.circle([lat, lng], { radius: 450, weight: 2, className: "approx-area" }).addTo(layer);
        continue;
      }
      const marker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: "price-marker-wrap",
          html: `<span class="price-marker" data-id="${l.id}">${formatRwfCompact(l.rentMonthlyRwf)}</span>`,
          iconSize: [0, 0],
        }),
        keyboard: true,
        title: l.title,
        riseOnHover: true,
      });
      marker.on("click", (e) => {
        L.DomEvent.stopPropagation(e);
        selectRef.current?.(l.id);
      });
      marker.addTo(layer);
      markersRef.current.set(l.id, marker);
    }

    boundsRef.current = bounds;
    if (el.current && el.current.clientWidth > 0) fit(map, bounds, !!single);
  }, [listings, single]);

  useEffect(() => {
    markersRef.current.forEach((m, id) => {
      const node = m.getElement()?.querySelector(".price-marker");
      node?.classList.toggle("is-active", id === activeId);
      m.setZIndexOffset(id === activeId ? 1000 : 0);
    });
  }, [activeId, listings]);

  return <div ref={el} className="h-full w-full" role="region" aria-label={label} />;
}
