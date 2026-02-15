import { getTappe } from "@/lib/data";
import TappeMap from "./TappeMap";

export const revalidate = 60;

export default async function MappaPage() {
  const tappe = await getTappe();
  const tappeConCoordinate = tappe.filter((t): t is typeof t & { lat: number; lng: number } => t.lat != null && t.lng != null);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">
          Dove si gioca
        </p>
        <h1 className="font-[family-name:var(--font-bebas)] text-6xl sm:text-7xl tracking-wider mb-6">
          <span className="gradient-text">MAPPA</span>
          <span className="text-foreground"> DEL TOUR</span>
        </h1>
        <p className="text-lg text-muted mb-8">
          Le tappe del Romagna Summer Hoops Tour sulla mappa. Clicca su un marker per dettagli e link.
        </p>

        <div className="rounded-2xl border border-border overflow-hidden bg-surface" style={{ minHeight: "480px" }}>
          <TappeMap tappe={tappeConCoordinate} />
        </div>

        {tappeConCoordinate.length === 0 && (
          <p className="text-sm text-muted mt-4">
            Nessuna tappa con coordinate ancora. L&apos;organizzazione può aggiungere lat/lng dalle tappe in admin.
          </p>
        )}
      </div>
    </div>
  );
}
