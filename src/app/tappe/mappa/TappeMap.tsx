"use client";

import { useEffect, useRef, useState } from "react";
import type { DbTappa } from "@/lib/types";
import "leaflet/dist/leaflet.css";

// Romagna center
const DEFAULT_CENTER: [number, number] = [44.2, 12.0];
const DEFAULT_ZOOM = 9;

// Dark map tiles (CartoDB Dark Matter)
const DARK_TILES =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const DARK_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

interface TappaWithCoords extends DbTappa {
  lat: number;
  lng: number;
}

interface TappeMapProps {
  tappe: TappaWithCoords[];
}

export default function TappeMap({ tappe }: TappeMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const mapRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    let cancelled = false;

    const loadMap = async () => {
      const L = await import("leaflet");

      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, { attributionControl: false }).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      mapRef.current = map;

      L.tileLayer(DARK_TILES, {
        attribution: DARK_ATTRIBUTION,
      }).addTo(map);

      if (tappe.length > 0) {
        tappe.forEach((t) => {
          const logoUrl = t.logo_url ? escapeHtml(t.logo_url) : "";
          const markerHtml = logoUrl
            ? `<div class="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white shadow-lg bg-surface overflow-hidden" style="box-sizing:border-box;"><img src="${logoUrl}" alt="" class="w-full h-full object-cover" /></div>`
            : `<div class="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white shadow-lg bg-primary text-white"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg></div>`;

          const icon = L.divIcon({
            html: markerHtml,
            className: "custom-tappa-marker",
            iconSize: [40, 40],
            iconAnchor: [20, 40],
          });

          const popup = L.popup().setContent(
            `<div class="min-w-[180px]">
              ${logoUrl ? `<img src="${logoUrl}" alt="" class="w-12 h-12 object-contain rounded-lg mb-2" />` : ""}
              <p class="font-semibold text-gray-900">${escapeHtml(t.nome_completo || t.nome)}</p>
              <p class="text-sm text-gray-600 mt-1">${escapeHtml(t.data)} ${t.orario ? `• ${escapeHtml(t.orario)}` : ""}</p>
              <p class="text-sm text-gray-600">${escapeHtml(t.luogo)}</p>
              <a href="/tappe/${escapeHtml(t.slug)}" class="inline-block mt-2 text-sm text-orange-600 font-medium hover:underline">Vai alla tappa →</a>
            </div>`
          );
          L.marker([t.lat, t.lng], { icon }).addTo(map).bindPopup(popup);
        });

        if (tappe.length > 1) {
          const bounds = L.latLngBounds(tappe.map((t) => [t.lat, t.lng] as [number, number]));
          map.fitBounds(bounds, { padding: [40, 40] });
        } else {
          map.setView([tappe[0].lat, tappe[0].lng], 12);
        }
      }
    };

    loadMap();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mounted, tappe]);

  if (!mounted) {
    return (
      <div ref={containerRef} className="w-full h-[400px] flex items-center justify-center text-muted">
        Caricamento mappa...
      </div>
    );
  }

  return <div ref={containerRef} className="w-full h-[400px] rounded-xl overflow-hidden" />;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
