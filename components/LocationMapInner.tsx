"use client";

// This file is intentionally isolated so the parent can load it with
// dynamic(..., { ssr: false }) — Leaflet accesses `window` at import time.

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";
import { Search, Loader2, Layers, MapPin } from "lucide-react";

// Fix Leaflet's default icon paths broken by bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const TILES = {
  normal: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "© Esri",
  },
};

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
}

interface Props {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
}

export default function LocationMapInner({ lat, lng, onChange }: Props) {
  const containerRef   = useRef<HTMLDivElement>(null);
  const mapRef         = useRef<L.Map | null>(null);
  const markerRef      = useRef<L.Marker | null>(null);
  const normalLayerRef = useRef<L.TileLayer | null>(null);
  const satLayerRef    = useRef<L.TileLayer | null>(null);
  const debounceRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchWrapRef  = useRef<HTMLDivElement>(null);

  const [isSatellite, setIsSatellite] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [showDrop,    setShowDrop]    = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // ── Initialise map once ────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const initialCenter: L.LatLngTuple =
      lat != null && lng != null ? [lat, lng] : [14.5995, 120.9842];
    const initialZoom = lat != null ? 14 : 6;

    const map = L.map(containerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      zoomControl: true,
    });

    const normalLayer = L.tileLayer(TILES.normal.url, {
      attribution: TILES.normal.attribution,
      maxZoom: 19,
    }).addTo(map);

    const satLayer = L.tileLayer(TILES.satellite.url, {
      attribution: TILES.satellite.attribution,
      maxZoom: 19,
    });

    normalLayerRef.current = normalLayer;
    satLayerRef.current    = satLayer;

    if (lat != null && lng != null) {
      markerRef.current = L.marker([lat, lng]).addTo(map);
    }

    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat: la, lng: lo } = e.latlng;
      if (markerRef.current) {
        markerRef.current.setLatLng([la, lo]);
      } else {
        markerRef.current = L.marker([la, lo]).addTo(map);
      }
      onChange(la, lo);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current         = null;
      markerRef.current      = null;
      normalLayerRef.current = null;
      satLayerRef.current    = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Swap tile layer ────────────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    const nl  = normalLayerRef.current;
    const sl  = satLayerRef.current;
    if (!map || !nl || !sl) return;
    if (isSatellite) { map.removeLayer(nl); sl.addTo(map); }
    else             { map.removeLayer(sl); nl.addTo(map); }
  }, [isSatellite]);

  // ── Sync external lat/lng ──────────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (lat == null || lng == null) {
      markerRef.current?.remove();
      markerRef.current = null;
      return;
    }
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng]).addTo(map);
    }
    map.setView([lat, lng], Math.max(map.getZoom(), 14));
  }, [lat, lng]);

  // ── Close dropdown on outside click ───────────────────────────────────────
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setShowDrop(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  // ── Debounced Nominatim fetch ──────────────────────────────────────────────
  const fetchSuggestions = useCallback(async (q: string) => {
    if (!q.trim()) { setSuggestions([]); setShowDrop(false); return; }
    setIsSearching(true);
    setSearchError(null);
    try {
      const res  = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=6`,
        { headers: { "Accept-Language": "en" } },
      );
      const data: NominatimResult[] = await res.json();
      setSuggestions(data);
      setShowDrop(data.length > 0);
      if (!data.length) setSearchError("No results found.");
    } catch {
      setSearchError("Search failed. Try again.");
      setSuggestions([]);
      setShowDrop(false);
    } finally {
      setIsSearching(false);
    }
  }, []);

  function handleInputChange(value: string) {
    setSearchQuery(value);
    setSearchError(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 400);
  }

  // ── Pick a suggestion ──────────────────────────────────────────────────────
  function selectResult(result: NominatimResult) {
    const la = parseFloat(result.lat);
    const lo = parseFloat(result.lon);
    setSearchQuery(result.display_name);
    setSuggestions([]);
    setShowDrop(false);
    setSearchError(null);
    if (!mapRef.current) return;
    mapRef.current.setView([la, lo], 16);
    if (markerRef.current) {
      markerRef.current.setLatLng([la, lo]);
    } else {
      markerRef.current = L.marker([la, lo]).addTo(mapRef.current);
    }
    onChange(la, lo);
  }

  // Enter key / button → pick first result
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (suggestions.length) { selectResult(suggestions[0]); return; }
    fetchSuggestions(searchQuery);
  }

  // Shorten long display names for the dropdown
  function shortName(display: string) {
    const parts = display.split(", ");
    return parts.length > 3 ? parts.slice(0, 3).join(", ") + "…" : display;
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full h-full gap-2">

      {/* ── Controls row ───────────────────────────────────────────────── */}
      <div className="flex gap-2 shrink-0">

        {/* Search with dropdown */}
        <div ref={searchWrapRef} className="relative flex gap-1 flex-1 min-w-0">
          <form onSubmit={handleSubmit} className="flex gap-1 flex-1 min-w-0">
            <input
              value={searchQuery}
              onChange={e => handleInputChange(e.target.value)}
              onFocus={() => { if (suggestions.length) setShowDrop(true); }}
              placeholder="Search location…"
              autoComplete="off"
              className="flex-1 min-w-0 h-8 px-3 text-xs rounded-lg
                         border border-gray-300 dark:border-gray-700
                         bg-white dark:bg-[#1a1a1a]
                         text-gray-900 dark:text-white placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-blue-500
                         transition"
            />
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="h-8 w-8 flex items-center justify-center shrink-0 rounded-lg
                         bg-blue-600 hover:bg-blue-700 text-white
                         disabled:opacity-50 transition cursor-pointer"
            >
              {isSearching
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Search  className="w-3.5 h-3.5" />}
            </button>
          </form>

          {/* Suggestions dropdown */}
          {showDrop && suggestions.length > 0 && (
            <ul className="absolute top-full left-0 right-8 mt-1 z-[999]
                           bg-white dark:bg-[#1e1e1e]
                           border border-gray-200 dark:border-gray-700
                           rounded-lg shadow-lg overflow-hidden">
              {suggestions.map(r => (
                <li key={r.place_id}>
                  <button
                    type="button"
                    onPointerDown={e => { e.preventDefault(); selectResult(r); }}
                    className="w-full flex items-start gap-2 px-3 py-2 text-left
                               hover:bg-blue-50 dark:hover:bg-blue-950/30
                               transition cursor-pointer"
                  >
                    <MapPin className="w-3 h-3 mt-0.5 shrink-0 text-blue-500" />
                    <span className="text-xs text-gray-800 dark:text-gray-200 leading-snug">
                      {shortName(r.display_name)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Normal / Satellite toggle */}
        <button
          type="button"
          onClick={() => setIsSatellite(v => !v)}
          title={isSatellite ? "Switch to normal map" : "Switch to satellite view"}
          className={cn(
            "h-8 px-2.5 flex items-center gap-1.5 shrink-0 rounded-lg text-xs font-semibold transition cursor-pointer",
            isSatellite
              ? "bg-blue-600 border border-blue-700 text-white"
              : "border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500",
          )}
        >
          <Layers className="w-3.5 h-3.5" />
          {isSatellite ? "Normal" : "Satellite"}
        </button>
      </div>

      {/* Search error */}
      {searchError && (
        <p className="shrink-0 text-xs text-red-600 dark:text-red-400
                      border border-red-200 dark:border-red-800
                      rounded-lg px-3 py-1.5 -mt-1">
          {searchError}
        </p>
      )}

      {/* Map canvas */}
      <div ref={containerRef} className="flex-1 min-h-0 rounded-lg overflow-hidden" />

    </div>
  );
}
