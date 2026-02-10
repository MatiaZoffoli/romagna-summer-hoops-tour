import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Users, Trophy, Instagram, User } from "lucide-react";
import { getSquadraBySlug, getTappe } from "@/lib/data";

export const revalidate = 60;

interface SquadraPageProps {
  params: Promise<{ id: string }>;
}

export default async function SquadraDetailPage({ params }: SquadraPageProps) {
  const { id } = await params;
  const [squadra, tappe] = await Promise.all([
    getSquadraBySlug(id),
    getTappe(),
  ]);

  if (!squadra) {
    notFound();
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back link */}
        <Link
          href="/squadre"
          className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Tutte le squadre
        </Link>

        {/* Header */}
        <div className="flex items-start gap-6 mb-10">
          <div className="w-20 h-20 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center shrink-0">
            <span className="font-[family-name:var(--font-bebas)] text-3xl text-primary">
              {squadra.nome.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="font-[family-name:var(--font-bebas)] text-5xl sm:text-6xl tracking-wider mb-2">
              {squadra.nome}
            </h1>
            {squadra.motto && (
              <p className="text-muted italic text-lg">&ldquo;{squadra.motto}&rdquo;</p>
            )}
            {squadra.instagram && (
              <a
                href={`https://instagram.com/${squadra.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-pink-400 hover:text-pink-300 transition-colors mt-2"
              >
                <Instagram size={14} />
                {squadra.instagram}
              </a>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="p-6 bg-surface rounded-xl border border-border text-center">
            <Trophy size={20} className="text-primary mx-auto mb-2" />
            <p className="font-[family-name:var(--font-bebas)] text-3xl text-primary">
              {squadra.punti_totali}
            </p>
            <p className="text-xs text-muted uppercase tracking-wider">Punti Totali</p>
          </div>
          <div className="p-6 bg-surface rounded-xl border border-border text-center">
            <Users size={20} className="text-accent mx-auto mb-2" />
            <p className="font-[family-name:var(--font-bebas)] text-3xl text-accent">
              {squadra.tappe_giocate}
            </p>
            <p className="text-xs text-muted uppercase tracking-wider">Tappe Giocate</p>
          </div>
          <div className="p-6 bg-surface rounded-xl border border-border text-center">
            <User size={20} className="text-gold mx-auto mb-2" />
            <p className="font-[family-name:var(--font-bebas)] text-3xl text-gold">
              {squadra.giocatori.length}/8
            </p>
            <p className="text-xs text-muted uppercase tracking-wider">Giocatori</p>
          </div>
        </div>

        {/* Roster */}
        <div className="mb-10">
          <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-4">
            ROSTER
          </h2>
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            {squadra.giocatori.map((g, i) => (
              <div
                key={g.id || i}
                className="flex items-center justify-between px-6 py-4 border-b border-border/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-surface-light rounded-full flex items-center justify-center">
                    <User size={18} className="text-muted" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {g.nome} {g.cognome}
                    </p>
                    {g.ruolo && (
                      <p className="text-xs text-muted">{g.ruolo}</p>
                    )}
                  </div>
                </div>
                {g.instagram && (
                  <a
                    href={`https://instagram.com/${g.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-1"
                  >
                    <Instagram size={12} />
                    {g.instagram}
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Risultati per tappa */}
        <div className="mb-10">
          <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-4">
            RISULTATI PER TAPPA
          </h2>
          {squadra.risultati.length > 0 ? (
            <div className="bg-surface rounded-2xl border border-border overflow-hidden">
              {squadra.risultati.map((r) => {
                const tappa = tappe.find((t) => t.id === r.tappa_id);
                return (
                  <div
                    key={r.id}
                    className="flex items-center justify-between px-6 py-4 border-b border-border/50"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {tappa?.nome || "Tappa"}
                      </p>
                      <p className="text-xs text-muted">{tappa?.data}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted">{r.posizione}° posto</p>
                      <p className="font-[family-name:var(--font-bebas)] text-lg text-primary">
                        {r.punti} PT
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 bg-surface rounded-xl border border-dashed border-border text-center">
              <p className="text-muted">
                Nessun risultato ancora. La squadra non ha ancora partecipato a una tappa.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
