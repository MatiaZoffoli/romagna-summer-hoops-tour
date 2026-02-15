"use client";

import { useEffect, useRef, useState } from "react";
import type { DbTappa } from "@/lib/types";
import "leaflet/dist/leaflet.css";

// Romagna center
const DEFAULT_CENTER: [number, number] = [44.2, 12.0];
const DEFAULT_ZOOM = 9;

interface TappeMapProps {
  tappe: (DbTappa & { lat: number; lng: number })[];
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

      const map = L.map(containerRef.current).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      if (tappe.length > 0) {
        tappe.forEach((t) => {
          const popup = L.popup().setContent(
            `<div class="min-w-[180px]">
              <p class="font-semibold text-gray-900">${escapeHtml(t.nome_completo || t.nome)}</p>
              <p class="text-sm text-gray-600 mt-1">${escapeHtml(t.data)} ${t.orario ? `• ${escapeHtml(t.orario)}` : ""}</p>
              <p class="text-sm text-gray-600">${escapeHtml(t.luogo)}</p>
              <a href="/tappe/${escapeHtml(t.slug)}" class="inline-block mt-2 text-sm text-orange-600 font-medium hover:underline">Vai alla tappa →</a>
            </div>`
          );
          L.marker([t.lat, t.lng]).addTo(map).bindPopup(popup);
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
      <div ref={containerRef} className="w-full h-[480px] flex items-center justify-center text-muted">
        Caricamento mappa...
      </div>
    );
  }

  return <div ref={containerRef} className="w-full h-[480px]" />;
}

function escapeHtml(s: string): string {
  const div = { textContent: s };
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
