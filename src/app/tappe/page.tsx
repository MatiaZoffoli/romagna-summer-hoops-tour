import Link from "next/link";
import { MapPin, Calendar, ArrowRight, Clock } from "lucide-react";
import { getTappe } from "@/lib/data";

export const revalidate = 60;

const statoBadge = {
  prossima: { label: "PROSSIMA", className: "bg-primary/20 text-primary border-primary/30" },
  completata: { label: "COMPLETATA", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  "in-arrivo": { label: "IN ARRIVO", className: "bg-accent/20 text-accent border-accent/30" },
};

export default async function TappePage() {
  const tappe = await getTappe();

  return (
    <div className="pt-24 pb-20">
      <section className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">
            Calendario Ufficiale
          </p>
          <h1 className="font-[family-name:var(--font-bebas)] text-6xl sm:text-7xl tracking-wider mb-6">
            LE <span className="gradient-text">TAPPE</span>
          </h1>
          <p className="text-lg text-muted">
            Ogni tappa è un torneo 3x3 indipendente che assegna punti per la classifica
            generale del Tour. Contatta direttamente l&apos;organizzatore per iscriverti.
          </p>
        </div>

        {/* Tappe grid */}
        <div className="space-y-4">
          {tappe.map((tappa, i) => {
            const badge = statoBadge[tappa.stato];
            return (
              <Link key={tappa.id} href={`/tappe/${tappa.slug}`}>
                <div className="relative p-6 sm:p-8 bg-surface rounded-2xl border border-border hover:border-primary/40 transition-all group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Number */}
                      <span className="font-[family-name:var(--font-bebas)] text-4xl text-primary/30 hidden sm:block">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="font-[family-name:var(--font-bebas)] text-3xl tracking-wider group-hover:text-primary transition-colors">
                            {tappa.nome}
                          </h2>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        </div>

                        <p className="text-xs text-muted mb-3">
                          Tappa ufficiale del Romagna Summer Hoops Tour
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                          <span className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-primary" />
                            {tappa.data}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock size={14} className="text-primary" />
                            {tappa.orario}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-accent" />
                            {tappa.luogo}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all">
                      Dettagli
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* More coming */}
        <div className="mt-8 p-6 bg-surface/50 rounded-2xl border border-dashed border-border text-center">
          <p className="text-muted">
            Altre tappe saranno annunciate nelle prossime settimane.
            <br />
            <Link href="/contatti" className="text-primary hover:text-gold transition-colors">
              Vuoi far diventare il tuo torneo una tappa?
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
