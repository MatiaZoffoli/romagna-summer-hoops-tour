import Link from "next/link";
import { Users, ArrowRight, Instagram, Trophy } from "lucide-react";
import { getSquadreConPunti } from "@/lib/data";

export const revalidate = 60;

export default async function SquadrePage() {
  const squadre = await getSquadreConPunti();

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">
              Le Squadre del Tour
            </p>
            <h1 className="font-[family-name:var(--font-bebas)] text-6xl sm:text-7xl tracking-wider mb-6">
              <span className="gradient-text">SQUADRE</span>
            </h1>
            <p className="text-lg text-muted">
              Tutte le squadre registrate al Romagna Summer Hoops Tour.
              Crea il tuo profilo e fatti conoscere.
            </p>
          </div>
          <Link
            href="/registrazione"
            className="shrink-0 px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <Users size={18} />
            Registra Squadra
          </Link>
        </div>

        {/* Teams grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {squadre.map((sq) => (
            <Link key={sq.id} href={`/squadre/${sq.id}`}>
              <div className="p-6 bg-surface rounded-2xl border border-border hover:border-primary/40 transition-all group h-full">
                {/* Team avatar placeholder */}
                <div className="w-16 h-16 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center mb-4">
                  <span className="font-[family-name:var(--font-bebas)] text-2xl text-primary">
                    {sq.nome.substring(0, 2).toUpperCase()}
                  </span>
                </div>

                <h3 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider group-hover:text-primary transition-colors mb-1">
                  {sq.nome}
                </h3>
                {sq.motto && (
                  <p className="text-sm text-muted italic mb-4">&ldquo;{sq.motto}&rdquo;</p>
                )}

                <div className="flex items-center justify-between text-sm text-muted mb-4">
                  <span className="flex items-center gap-1.5">
                    <Users size={14} />
                    {sq.giocatori.length} giocatori
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Trophy size={14} className="text-primary" />
                    {sq.tappe_giocate} tappe
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="font-[family-name:var(--font-bebas)] text-xl text-primary">
                    {sq.punti_totali} PT
                  </div>
                  {sq.instagram && (
                    <span className="text-xs text-muted flex items-center gap-1">
                      <Instagram size={12} />
                      {sq.instagram}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}

          {/* Placeholder card */}
          <Link href="/registrazione">
            <div className="p-6 bg-surface/30 rounded-2xl border border-dashed border-border hover:border-primary/40 transition-all flex flex-col items-center justify-center text-center h-full min-h-[280px] group">
              <div className="w-16 h-16 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-center mb-4">
                <span className="text-3xl text-primary/50">+</span>
              </div>
              <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider text-muted group-hover:text-primary transition-colors mb-2">
                LA TUA SQUADRA QUI
              </h3>
              <p className="text-sm text-muted/60">
                Registrati e crea il tuo profilo squadra
              </p>
              <span className="mt-4 text-primary flex items-center gap-1 text-sm font-medium">
                Registrati <ArrowRight size={14} />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
