import { Trophy, Users, Target, Star, Zap, Award, CheckCircle } from "lucide-react";
import { sistemaPunteggio } from "@/data/placeholder";

export default function IlTourPage() {
  return (
    <div className="pt-24 pb-20">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 mb-16">
        <div className="max-w-3xl">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">
            Regolamento Ufficiale
          </p>
          <h1 className="font-[family-name:var(--font-bebas)] text-6xl sm:text-7xl tracking-wider mb-6">
            <span className="text-foreground">IL </span>
            <span className="gradient-text">TOUR</span>
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            Il Romagna Summer Hoops Tour è un circuito estivo di basket 3x3 che unisce,
            valorizza e potenzia i tornei già esistenti sul territorio della Romagna.
            Non è un singolo torneo, ma un progetto condiviso che crea una rete tra
            organizzatori, squadre e community.
          </p>
        </div>
      </section>

      {/* Vision */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: Target,
              title: "LA VISIONE",
              desc: "Creare un'esperienza estiva unica dedicata allo streetbasket. Il Tour celebra il basket 3x3 come cultura, competizione e aggregazione.",
            },
            {
              icon: Star,
              title: "L'OBIETTIVO",
              desc: "Culminare con un evento finale esclusivo - The Finals - che incorona la miglior squadra 3x3 dell'estate in Romagna.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="p-8 bg-surface rounded-2xl border border-border"
            >
              <item.icon size={32} className="text-primary mb-4" />
              <h3 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-3">
                {item.title}
              </h3>
              <p className="text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Ambito */}
      <section className="bg-surface/50 py-16 px-4 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-accent rounded-full" />
            <h2 className="font-[family-name:var(--font-bebas)] text-4xl tracking-wider">
              AMBITO E DURATA
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Area Geografica", value: "Romagna" },
              { label: "Province", value: "Forlì-Cesena, Rimini, Ravenna" },
              { label: "Periodo", value: "Maggio - Settembre" },
              { label: "Numero Tappe", value: "6 – 12 tappe" },
            ].map((item) => (
              <div
                key={item.label}
                className="p-6 bg-surface rounded-xl border border-border"
              >
                <p className="text-xs text-muted uppercase tracking-wider mb-2">
                  {item.label}
                </p>
                <p className="font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Struttura */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-primary rounded-full" />
          <h2 className="font-[family-name:var(--font-bebas)] text-4xl tracking-wider">
            STRUTTURA DEL TOUR
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-6 bg-surface rounded-xl border border-border">
            <h3 className="font-semibold text-foreground mb-2">Tornei Esistenti come Tappe</h3>
            <p className="text-sm text-muted leading-relaxed">
              I tornei 3x3 già esistenti diventano Tappe ufficiali del Tour. Ogni tappa è
              organizzata in piena autonomia dagli organizzatori locali: mantengono il proprio
              nome, il proprio format e la propria gestione operativa.
            </p>
          </div>
          <div className="p-6 bg-surface rounded-xl border border-border">
            <h3 className="font-semibold text-foreground mb-2">Struttura Comune</h3>
            <p className="text-sm text-muted leading-relaxed">
              Il Tour collega tutte le tappe attraverso una classifica generale, un sistema
              di punteggio condiviso e una narrazione unica della stagione.
            </p>
          </div>
          <div className="p-6 bg-surface rounded-xl border border-border">
            <h3 className="font-semibold text-foreground mb-2">Evento Finale</h3>
            <p className="text-sm text-muted leading-relaxed">
              La stagione si conclude con le Romagna Summer Hoops Tour - The Finals, dove le
              top 16 squadre si sfidano per il titolo.
            </p>
          </div>
        </div>
      </section>

      {/* Squadre e identità */}
      <section className="bg-surface/50 py-16 px-4 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-gold rounded-full" />
            <h2 className="font-[family-name:var(--font-bebas)] text-4xl tracking-wider">
              SQUADRE E IDENTITÀ
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-primary shrink-0 mt-1" />
                <p className="text-muted">
                  Le squadre si iscrivono ai singoli tornei, non al Tour.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-primary shrink-0 mt-1" />
                <p className="text-muted">
                  Ogni squadra iscritta a una tappa entra automaticamente nella classifica generale.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-primary shrink-0 mt-1" />
                <p className="text-muted">
                  Non è obbligatorio partecipare a tutte le tappe.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle size={20} className="text-primary shrink-0 mt-1" />
                <p className="text-muted">
                  Per qualificarsi alle Finals serve partecipare ad almeno 2 tappe.
                </p>
              </div>
            </div>
            <div className="p-6 bg-surface rounded-xl border border-primary/30">
              <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider text-primary mb-4">
                REGOLE DI IDENTITÀ SQUADRA
              </h3>
              <p className="text-sm text-muted mb-4">
                Per essere considerata la stessa squadra nel corso del Tour:
              </p>
              <ol className="space-y-2 text-sm text-muted list-decimal list-inside">
                <li>Stesso nome della squadra</li>
                <li>Presenza di almeno 2 giocatori già utilizzati in precedenza</li>
              </ol>
              <p className="text-sm text-muted mt-4">
                <span className="text-primary font-semibold">Max 8 giocatori</span> totali
                durante l&apos;intero Tour. Una volta raggiunto questo numero, non sarà possibile
                aggiungerne di nuovi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sistema punteggio */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-8 bg-primary rounded-full" />
          <h2 className="font-[family-name:var(--font-bebas)] text-4xl tracking-wider">
            SISTEMA DI PUNTEGGIO
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Points table */}
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider">
                PUNTI PER TAPPA
              </h3>
            </div>
            {sistemaPunteggio.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-6 py-3 border-b border-border/50"
              >
                <span className="text-muted">{item.posizione}</span>
                <span className="font-[family-name:var(--font-bebas)] text-xl text-primary">
                  {item.punti} PT
                </span>
              </div>
            ))}
          </div>

          {/* Bonus & Tiebreakers */}
          <div className="space-y-6">
            <div className="p-6 bg-surface rounded-2xl border border-gold/30">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={20} className="text-gold" />
                <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider text-gold">
                  BONUS COSTANZA
                </h3>
              </div>
              <p className="text-muted text-sm leading-relaxed">
                Per ogni tappa disputata dopo la prima, la squadra riceve{" "}
                <span className="text-gold font-bold">+5 punti aggiuntivi</span>.
                Più giochi, più guadagni!
              </p>
            </div>

            <div className="p-6 bg-surface rounded-2xl border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Award size={20} className="text-accent" />
                <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider">
                  IN CASO DI PARITÀ
                </h3>
              </div>
              <ol className="space-y-2 text-sm text-muted list-decimal list-inside">
                <li>Maggior numero di tappe disputate</li>
                <li>Miglior piazzamento medio</li>
                <li>Miglior piazzamento nell&apos;ultima tappa disputata</li>
              </ol>
            </div>

            {/* Category */}
            <div className="p-6 bg-surface rounded-2xl border border-border">
              <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider mb-3">
                CATEGORIE
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-primary rounded-full" />
                  <span className="text-foreground font-medium">Maschile 16+</span>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    ATTIVA
                  </span>
                </div>
                <div className="flex items-center gap-3 opacity-40">
                  <span className="w-3 h-3 bg-muted rounded-full" />
                  <span className="text-muted">Under 16</span>
                  <span className="text-xs bg-surface-light text-muted px-2 py-0.5 rounded-full">
                    COMING SOON
                  </span>
                </div>
                <div className="flex items-center gap-3 opacity-40">
                  <span className="w-3 h-3 bg-muted rounded-full" />
                  <span className="text-muted">Femminile</span>
                  <span className="text-xs bg-surface-light text-muted px-2 py-0.5 rounded-full">
                    COMING SOON
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
