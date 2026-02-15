import { getTappe, getMvps, parseItalianDate } from "@/lib/data";
import MvpGrid from "@/components/MvpGrid";
import type { MvpSlot, MvpSlotTappa } from "@/components/MvpGrid";

export const revalidate = 60;

const MVP_TAPPA_STATI = ["confermata", "in_corso", "conclusa"] as const;

function toSlotTappa(t: { id: string; nome: string; slug: string; data: string }): MvpSlotTappa {
  return { id: t.id, nome: t.nome, slug: t.slug, data: t.data };
}

export default async function MvpPage() {
  const [tappe, mvps] = await Promise.all([getTappe(), getMvps()]);

  const eligibleTappe = tappe.filter((t) =>
    (MVP_TAPPA_STATI as readonly string[]).includes(t.stato)
  );
  eligibleTappe.sort((a, b) => {
    const da = parseItalianDate(a.data)?.getTime() ?? 0;
    const db = parseItalianDate(b.data)?.getTime() ?? 0;
    return db - da;
  });

  const mvpByTappaId = new Map(mvps.map((m) => [m.tappa_id, m]));

  const slots: MvpSlot[] = eligibleTappe.map((tappa) => {
    const mvp = mvpByTappaId.get(tappa.id);
    const t = toSlotTappa(tappa);
    if (mvp) {
      return { type: "mvp" as const, tappa: t, mvp };
    }
    return { type: "placeholder" as const, tappa: t };
  });

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">
          I protagonisti del Tour
        </p>
        <h1 className="font-[family-name:var(--font-bebas)] text-6xl sm:text-7xl tracking-wider mb-6">
          <span className="gradient-text">MVP</span>
          <span className="text-foreground"> DEL TOUR</span>
        </h1>
        <p className="text-lg text-muted mb-12">
          I migliori giocatori di ogni tappa. Foto, carriera e statistiche.
        </p>

        <MvpGrid slots={slots} />
      </div>
    </div>
  );
}
