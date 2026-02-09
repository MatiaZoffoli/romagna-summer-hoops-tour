import Link from "next/link";
import { Trophy, Flame, MapPin, Music, UtensilsCrossed, Clock } from "lucide-react";

export default function FinalsPage() {
  // Placeholder 16 teams for the bracket
  const placeholderTeams = Array.from({ length: 16 }, (_, i) => ({
    posizione: i + 1,
    nome: i < 4 ? ["I Predatori", "Rimini Ballers", "Cesena Wolves", "Ravenna Thunder"][i] : `Squadra #${i + 1}`,
    isPlaceholder: i >= 4,
  }));

  const gironi = [
    { nome: "GIRONE A", squadre: placeholderTeams.slice(0, 4) },
    { nome: "GIRONE B", squadre: placeholderTeams.slice(4, 8) },
    { nome: "GIRONE C", squadre: placeholderTeams.slice(8, 12) },
    { nome: "GIRONE D", squadre: placeholderTeams.slice(12, 16) },
  ];

  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,107,53,0.2),transparent_60%)]" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full text-gold text-sm font-medium mb-8">
            <Flame size={16} />
            Evento Finale - Settembre 2026
          </div>

          <h1 className="font-[family-name:var(--font-bebas)] text-7xl sm:text-8xl md:text-9xl tracking-wider mb-6">
            <span className="text-foreground">THE</span>
            <br />
            <span className="gradient-text">FINALS</span>
          </h1>

          <p className="text-xl text-muted max-w-2xl mx-auto mb-8">
            L&apos;evento che incorona la miglior squadra 3x3 dell&apos;estate in Romagna.
            <br />
            Un giorno. 16 squadre. Un solo campione.
          </p>

          <div className="font-[family-name:var(--font-bebas)] text-5xl sm:text-6xl tracking-wider text-gold animate-pulse-glow inline-block px-8 py-4 rounded-2xl bg-surface border border-gold/20">
            CHI SARANNO I RE DELL&apos;ESTATE?
          </div>
        </div>
      </section>

      {/* Info cards */}
      <section className="py-16 px-4 bg-surface/50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-6 bg-surface rounded-xl border border-border text-center">
            <Trophy size={24} className="text-gold mx-auto mb-3" />
            <p className="font-[family-name:var(--font-bebas)] text-xl tracking-wider">FORMATO</p>
            <p className="text-sm text-muted mt-1">4 gironi da 4 squadre</p>
            <p className="text-sm text-muted">Quarti, Semi, Finale</p>
          </div>
          <div className="p-6 bg-surface rounded-xl border border-border text-center">
            <Clock size={24} className="text-primary mx-auto mb-3" />
            <p className="font-[family-name:var(--font-bebas)] text-xl tracking-wider">REGOLAMENTO</p>
            <p className="text-sm text-muted mt-1">FIBA 3x3 ufficiale</p>
            <p className="text-sm text-muted">21 punti o 10 minuti</p>
          </div>
          <div className="p-6 bg-surface rounded-xl border border-border text-center">
            <MapPin size={24} className="text-accent mx-auto mb-3" />
            <p className="font-[family-name:var(--font-bebas)] text-xl tracking-wider">LOCATION</p>
            <p className="text-sm text-muted mt-1">Da definire</p>
            <p className="text-sm text-muted">Stabilimento balneare</p>
          </div>
          <div className="p-6 bg-surface rounded-xl border border-border text-center">
            <Music size={24} className="text-pink-400 mx-auto mb-3" />
            <p className="font-[family-name:var(--font-bebas)] text-xl tracking-wider">VIBES</p>
            <p className="text-sm text-muted mt-1">DJ Set, Food Truck</p>
            <p className="text-sm text-muted">Street Culture</p>
          </div>
        </div>
      </section>

      {/* Bracket / Gironi */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1 h-8 bg-gold rounded-full" />
            <h2 className="font-[family-name:var(--font-bebas)] text-4xl tracking-wider">
              TABELLONE FINALS
            </h2>
          </div>

          {/* 4 Groups */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {gironi.map((girone) => (
              <div
                key={girone.nome}
                className="bg-surface rounded-2xl border border-border overflow-hidden"
              >
                <div className="px-6 py-3 bg-surface-light border-b border-border">
                  <h3 className="font-[family-name:var(--font-bebas)] text-lg tracking-wider text-gold">
                    {girone.nome}
                  </h3>
                </div>
                {girone.squadre.map((sq) => (
                  <div
                    key={sq.posizione}
                    className={`flex items-center justify-between px-6 py-3 border-b border-border/50 ${
                      sq.isPlaceholder ? "opacity-30" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-[family-name:var(--font-bebas)] text-lg text-muted w-6">
                        {sq.posizione}
                      </span>
                      <span className={sq.isPlaceholder ? "text-muted italic" : "font-medium"}>
                        {sq.isPlaceholder ? "Da qualificare..." : sq.nome}
                      </span>
                    </div>
                    {!sq.isPlaceholder && (
                      <span className="text-xs text-primary">Qualificata</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Knockout bracket placeholder */}
          <div className="bg-surface rounded-2xl border border-border p-8 text-center">
            <h3 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-4 text-foreground">
              FASE AD ELIMINAZIONE DIRETTA
            </h3>
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
              <div className="p-4 bg-surface-light rounded-xl border border-border">
                <p className="font-[family-name:var(--font-bebas)] text-lg text-accent">QUARTI</p>
                <p className="text-xs text-muted">8 squadre</p>
              </div>
              <div className="p-4 bg-surface-light rounded-xl border border-border">
                <p className="font-[family-name:var(--font-bebas)] text-lg text-primary">SEMIFINALI</p>
                <p className="text-xs text-muted">4 squadre</p>
              </div>
              <div className="p-4 bg-surface-light rounded-xl border border-gold/30">
                <p className="font-[family-name:var(--font-bebas)] text-lg text-gold">FINALE</p>
                <p className="text-xs text-muted">Senza limite di tempo</p>
              </div>
            </div>
            <p className="text-sm text-muted">
              Il tabellone completo sarà disponibile dopo la qualificazione delle 16 squadre.
            </p>
          </div>
        </div>
      </section>

      {/* Finale 3° posto */}
      <section className="py-16 px-4 bg-surface/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-bebas)] text-4xl tracking-wider mb-4">
            FINALE 1° E 3° POSTO
          </h2>
          <p className="text-muted max-w-xl mx-auto mb-6">
            The Finals si chiudono con la finalissima{" "}
            <span className="text-gold font-semibold">senza limite di tempo</span>.
            L&apos;ultima squadra in piedi sarà incoronata campione del Romagna Summer Hoops Tour 2026.
          </p>
          <p className="text-muted text-sm">
            Regolamento FIBA 3x3 ufficiale · Partite a 21 punti o 10 minuti · Finalissima senza limite
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-bebas)] text-5xl tracking-wider mb-6">
            <span className="text-foreground">VUOI ESSERE TRA I </span>
            <span className="text-gold">16?</span>
          </h2>
          <p className="text-muted max-w-xl mx-auto mb-8">
            Partecipa alle tappe del Tour, accumula punti e qualificati per l&apos;evento
            dell&apos;estate. Il palco è tuo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/tappe"
              className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors"
            >
              Scopri le Tappe
            </Link>
            <Link
              href="/classifica"
              className="px-8 py-4 border border-foreground/20 text-foreground rounded-full hover:border-gold hover:text-gold transition-colors"
            >
              Vedi Classifica
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
