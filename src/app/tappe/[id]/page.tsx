import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Calendar, Clock, User, Mail, Instagram, ArrowLeft, Trophy } from "lucide-react";
import { tappe } from "@/data/placeholder";

interface TappaPageProps {
  params: Promise<{ id: string }>;
}

export default async function TappaDetailPage({ params }: TappaPageProps) {
  const { id } = await params;
  const tappa = tappe.find((t) => t.id === id);

  if (!tappa) {
    notFound();
  }

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back link */}
        <Link
          href="/tappe"
          className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Tutte le tappe
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                tappa.stato === "prossima"
                  ? "bg-primary/20 text-primary border-primary/30"
                  : tappa.stato === "completata"
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-accent/20 text-accent border-accent/30"
              }`}
            >
              {tappa.stato === "prossima"
                ? "PROSSIMA TAPPA"
                : tappa.stato === "completata"
                ? "COMPLETATA"
                : "IN ARRIVO"}
            </span>
          </div>

          <h1 className="font-[family-name:var(--font-bebas)] text-6xl sm:text-7xl tracking-wider mb-3">
            {tappa.nome}
          </h1>
          <p className="text-muted">
            {tappa.nomeCompleto}
          </p>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="p-6 bg-surface rounded-xl border border-border">
            <div className="flex items-center gap-2 text-primary mb-3">
              <Calendar size={18} />
              <span className="text-xs uppercase tracking-wider font-semibold">Data e Ora</span>
            </div>
            <p className="text-foreground font-medium">{tappa.data}</p>
            <p className="text-muted text-sm">Ore {tappa.orario}</p>
          </div>

          <div className="p-6 bg-surface rounded-xl border border-border">
            <div className="flex items-center gap-2 text-accent mb-3">
              <MapPin size={18} />
              <span className="text-xs uppercase tracking-wider font-semibold text-accent">Luogo</span>
            </div>
            <p className="text-foreground font-medium">{tappa.luogo}</p>
            <p className="text-muted text-sm">{tappa.indirizzo}</p>
          </div>

          <div className="p-6 bg-surface rounded-xl border border-border">
            <div className="flex items-center gap-2 text-gold mb-3">
              <User size={18} />
              <span className="text-xs uppercase tracking-wider font-semibold text-gold">Organizzatore</span>
            </div>
            <p className="text-foreground font-medium">{tappa.organizzatore}</p>
            <a
              href={`mailto:${tappa.contattoOrganizzatore}`}
              className="flex items-center gap-1.5 text-muted text-sm hover:text-primary transition-colors mt-1"
            >
              <Mail size={14} />
              {tappa.contattoOrganizzatore}
            </a>
          </div>

          <div className="p-6 bg-surface rounded-xl border border-border">
            <div className="flex items-center gap-2 text-pink-400 mb-3">
              <Instagram size={18} />
              <span className="text-xs uppercase tracking-wider font-semibold text-pink-400">Social</span>
            </div>
            <a
              href={tappa.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground font-medium hover:text-primary transition-colors"
            >
              Segui su Instagram
            </a>
            <p className="text-muted text-sm">Per aggiornamenti e iscrizioni</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-10">
          <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-4">
            DESCRIZIONE
          </h2>
          <p className="text-muted leading-relaxed">{tappa.descrizione}</p>
        </div>

        {/* Category */}
        <div className="mb-10">
          <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-4">
            CATEGORIA
          </h2>
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-primary/20 border border-primary/40 rounded-full text-sm font-semibold text-primary">
              MASCHILE 16+
            </span>
            <span className="px-4 py-2 bg-surface border border-border rounded-full text-sm text-muted/50 coming-soon">
              UNDER 16 - Coming Soon
            </span>
            <span className="px-4 py-2 bg-surface border border-border rounded-full text-sm text-muted/50 coming-soon">
              FEMMINILE - Coming Soon
            </span>
          </div>
        </div>

        {/* Results placeholder */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Trophy size={20} className="text-gold" />
            <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider">
              RISULTATI
            </h2>
          </div>

          {tappa.risultati && tappa.risultati.length > 0 ? (
            <div className="bg-surface rounded-xl border border-border overflow-hidden">
              {tappa.risultati.map((r) => (
                <div
                  key={r.posizione}
                  className="flex items-center justify-between px-6 py-3 border-b border-border/50"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-[family-name:var(--font-bebas)] text-2xl ${
                        r.posizione === 1
                          ? "text-gold"
                          : r.posizione === 2
                          ? "text-gray-400"
                          : r.posizione === 3
                          ? "text-orange-600"
                          : "text-muted"
                      }`}
                    >
                      {r.posizione}°
                    </span>
                    <span className="font-medium">{r.squadra}</span>
                  </div>
                  <span className="font-[family-name:var(--font-bebas)] text-lg text-primary">
                    {r.puntiTour} PT
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-surface rounded-xl border border-dashed border-border text-center">
              <p className="text-muted">
                I risultati saranno pubblicati al termine della tappa.
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="p-8 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20 text-center">
          <h3 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-2">
            VUOI PARTECIPARE?
          </h3>
          <p className="text-muted text-sm mb-4">
            Contatta direttamente l&apos;organizzatore per iscrivere la tua squadra a questa tappa.
          </p>
          <a
            href={`mailto:${tappa.contattoOrganizzatore}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors"
          >
            <Mail size={18} />
            Contatta {tappa.organizzatore}
          </a>
        </div>
      </div>
    </div>
  );
}
