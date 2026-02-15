import Link from "next/link";
import { Trophy, Info, Lock } from "lucide-react";
import { getClassifica } from "@/lib/data";
import ClassificaLiveRefresh from "@/components/ClassificaLiveRefresh";

export const revalidate = 60;

export default async function ClassificaPage() {
  const { squadre: classificaOrdinata, tappe } = await getClassifica();

  const tappeCompletate = tappe.filter((t) => t.stato === "conclusa").length;
  const squadreInGraduatoria = classificaOrdinata.filter((s) => s.tappe_giocate >= 2).length;

  // Dynamic grid columns: # + Squadra + N tappe + Tappe + Social + Punti
  const desktopCols = `60px 1fr repeat(${tappe.length}, 80px) 80px 60px 100px`;
  const mobileCols = "50px 1fr 60px 50px 80px";

  return (
    <div className="pt-24 pb-20">
      <ClassificaLiveRefresh />
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">
            Aggiornata in tempo reale
          </p>
          <h1 className="font-[family-name:var(--font-bebas)] text-6xl sm:text-7xl tracking-wider mb-6">
            <span className="gradient-text">CLASSIFICA</span>
            <span className="text-foreground"> GENERALE</span>
          </h1>
          <p className="text-lg text-muted">
            La classifica generale del Romagna Summer Hoops Tour. Aggiornata dopo ogni tappa.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="p-4 bg-surface rounded-xl border border-border text-center">
            <p className="font-[family-name:var(--font-bebas)] text-3xl text-primary">
              {squadreInGraduatoria}
            </p>
            <p className="text-xs text-muted uppercase tracking-wider">Squadre (≥2 tappe)</p>
          </div>
          <div className="p-4 bg-surface rounded-xl border border-border text-center">
            <p className="font-[family-name:var(--font-bebas)] text-3xl text-accent">
              {tappeCompletate}/{tappe.length}
            </p>
            <p className="text-xs text-muted uppercase tracking-wider">Tappe Completate</p>
          </div>
          <div className="p-4 bg-surface rounded-xl border border-border text-center">
            <p className="font-[family-name:var(--font-bebas)] text-3xl text-gold">16</p>
            <p className="text-xs text-muted uppercase tracking-wider">Si Qualificano</p>
          </div>
          <div className="p-4 bg-surface rounded-xl border border-border text-center">
            <p className="font-[family-name:var(--font-bebas)] text-3xl text-foreground">2</p>
            <p className="text-xs text-muted uppercase tracking-wider">Tappe Minime</p>
          </div>
        </div>

        {/* Category selector */}
        <div className="flex items-center gap-3 mb-6">
          <button className="px-4 py-2 bg-primary/20 border border-primary/40 rounded-full text-sm font-semibold text-primary">
            MASCHILE 16+
          </button>
          <button className="px-4 py-2 bg-surface border border-border rounded-full text-sm text-muted/50 cursor-not-allowed" disabled>
            UNDER 16 - Coming Soon
          </button>
          <button className="px-4 py-2 bg-surface border border-border rounded-full text-sm text-muted/50 cursor-not-allowed" disabled>
            FEMMINILE - Coming Soon
          </button>
        </div>

        {/* Ranking table */}
        <div className="bg-surface rounded-2xl border border-border overflow-hidden mb-8">
          {/* Header row */}
          <div
            className="hidden sm:grid items-center px-6 py-3 border-b border-border text-xs text-muted uppercase tracking-wider"
            style={{ gridTemplateColumns: desktopCols }}
          >
            <span>#</span>
            <span>Squadra</span>
            {tappe.map((t) => (
              <span key={t.id} className="text-center">
                {t.nome}
              </span>
            ))}
            <span className="text-center">Tappe</span>
            <span className="text-center" title="Bonus social (+5 pt per tappa)">Social</span>
            <span className="text-right">Punti</span>
          </div>

          {/* Mobile header */}
          <div
            className="grid sm:hidden items-center px-4 py-3 border-b border-border text-[10px] text-muted uppercase tracking-wider"
            style={{ gridTemplateColumns: mobileCols }}
          >
            <span>#</span>
            <span>Squadra</span>
            <span className="text-center">Tappe</span>
            <span className="text-center">Social</span>
            <span className="text-right">Punti</span>
          </div>

          {classificaOrdinata.length > 0 ? (
            classificaOrdinata.map((sq, i) => {
              const inGraduatoria = sq.tappe_giocate >= 2;
              const rowOpacity = inGraduatoria ? (i < 16 ? "" : "opacity-60") : "opacity-60";
              const rankColor =
                inGraduatoria && i === 0
                  ? "text-gold"
                  : inGraduatoria && i === 1
                  ? "text-gray-400"
                  : inGraduatoria && i === 2
                  ? "text-orange-600"
                  : "text-muted";
              return (
                <Link key={sq.id} href={`/squadre/${sq.id}`}>
                  {/* Desktop row */}
                  <div
                    className={`hidden sm:grid items-center px-6 py-4 border-b border-border/50 hover:bg-surface-light transition-colors ${rowOpacity}`}
                    style={{ gridTemplateColumns: desktopCols }}
                  >
                    <span className={`font-[family-name:var(--font-bebas)] text-2xl ${rankColor}`}>
                      {i + 1}
                    </span>
                    <div>
                      <span className="font-semibold text-foreground">{sq.nome}</span>
                      {!inGraduatoria && (
                        <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                          <Lock size={10} /> Non in classifica — servono almeno 2 tappe
                        </p>
                      )}
                      {sq.motto && inGraduatoria && (
                        <p className="text-xs text-muted">{sq.motto}</p>
                      )}
                    </div>
                    {tappe.map((t) => {
                      const risultato = sq.risultati.find(
                        (r) => r.tappa_id === t.id
                      );
                      return (
                        <span key={t.id} className="text-center text-sm text-muted">
                          {risultato ? risultato.punti : "-"}
                        </span>
                      );
                    })}
                    <span className="text-center text-muted">{sq.tappe_giocate}</span>
                    <span className="text-center text-muted" title="Bonus social">
                      {(sq as { bonus_social_count?: number }).bonus_social_count ? (sq as { bonus_social_count: number }).bonus_social_count : "—"}
                    </span>
                    <span className="text-right font-[family-name:var(--font-bebas)] text-xl text-primary">
                      {sq.punti_totali}
                    </span>
                  </div>

                  {/* Mobile row */}
                  <div
                    className={`grid sm:hidden items-center px-4 py-4 border-b border-border/50 hover:bg-surface-light transition-colors ${rowOpacity}`}
                    style={{ gridTemplateColumns: mobileCols }}
                  >
                    <span className={`font-[family-name:var(--font-bebas)] text-2xl ${rankColor}`}>
                      {i + 1}
                    </span>
                    <div>
                      <span className="font-semibold text-foreground">{sq.nome}</span>
                      {!inGraduatoria && (
                        <p className="text-xs text-muted flex items-center gap-1 mt-0.5">
                          <Lock size={10} /> 2 tappe minime
                        </p>
                      )}
                    </div>
                    <span className="text-center text-muted">{sq.tappe_giocate}</span>
                    <span className="text-center text-muted">
                      {(sq as { bonus_social_count?: number }).bonus_social_count ? (sq as { bonus_social_count: number }).bonus_social_count : "—"}
                    </span>
                    <span className="text-right font-[family-name:var(--font-bebas)] text-xl text-primary">
                      {sq.punti_totali}
                    </span>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="px-6 py-16 text-center text-muted">
              <Trophy size={48} className="mx-auto mb-4 text-primary/30" />
              <p className="text-lg font-medium mb-2">
                La classifica e&apos; in attesa dei primi risultati
              </p>
              <p className="text-sm">
                Verra&apos; aggiornata dopo la prima tappa del Tour.
              </p>
            </div>
          )}
        </div>

        {/* Qualification line */}
        <div className="flex items-start gap-3 p-4 bg-surface/50 rounded-xl border border-border">
          <Info size={18} className="text-accent shrink-0 mt-0.5" />
          <div className="text-sm text-muted">
            <p>
              Le <span className="text-gold font-semibold">top 16 squadre</span> si
              qualificano per{" "}
              <Link href="/finals" className="text-primary hover:text-gold transition-colors">
                The Finals
              </Link>
              . In classifica figurano tutte le squadre iscritte; quelle con almeno 2 tappe disputate entrano in graduatoria ufficiale e concorrono per le top 16.
            </p>
            <p className="mt-1">
              In caso di parita&apos;: 1) piu&apos; tappe disputate, 2) miglior piazzamento medio,
              3) miglior piazzamento nell&apos;ultima tappa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
