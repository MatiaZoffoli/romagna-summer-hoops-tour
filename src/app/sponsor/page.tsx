import { Star, Mail, Users, Camera, Video, Music, Mic, Palette, UtensilsCrossed, Shirt, HeartPulse, PartyPopper, Instagram, Smartphone } from "lucide-react";
import Link from "next/link";
import { crew } from "@/data/placeholder";

const crewIcons: Record<string, React.ElementType> = {
  "official-photographer": Camera,
  "official-videographer": Video,
  "official-content-creator": Smartphone,
  "official-dj": Music,
  "official-voice": Mic,
  "official-after-party": PartyPopper,
  "official-graphic-designer": Palette,
  "official-food-truck": UtensilsCrossed,
  "official-streetwear": Shirt,
  "official-physio": HeartPulse,
};

export default function SponsorPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">
            Partner e Crew
          </p>
          <h1 className="font-[family-name:var(--font-bebas)] text-6xl sm:text-7xl tracking-wider mb-6">
            <span className="gradient-text">SPONSOR</span>
            <span className="text-foreground"> & CREW</span>
          </h1>
          <p className="text-lg text-muted">
            Il Romagna Summer Hoops Tour e&apos; reso possibile grazie ai nostri sponsor, partner
            e alla Crew ufficiale di professionisti che rendono ogni tappa un&apos;esperienza unica.
          </p>
        </div>

        {/* ===== RSHT CREW SECTION ===== */}
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="font-[family-name:var(--font-bebas)] text-4xl tracking-wider">
              RSHT CREW
            </h2>
          </div>
          <p className="text-muted max-w-2xl mb-10">
            I professionisti ufficiali del Romagna Summer Hoops Tour. Disponibili per tutte
            le tappe del circuito e protagonisti a The Finals. Vuoi ingaggiarli per la tua
            tappa? Contattali direttamente.
          </p>

          {/* Crew grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {crew.map((member) => {
              const Icon = crewIcons[member.id] || Users;
              return (
                <div
                  key={member.id}
                  className="relative p-6 bg-surface rounded-2xl border border-border hover:border-primary/40 transition-all group"
                >
                  {/* Available badge */}
                  {member.disponibile && (
                    <div className="absolute top-4 right-4">
                      <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-[10px] text-green-400 font-medium">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        Disponibile
                      </span>
                    </div>
                  )}

                  {/* Icon */}
                  <div className="w-14 h-14 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon size={24} className="text-primary" />
                  </div>

                  {/* Role */}
                  <p className="font-[family-name:var(--font-bebas)] text-xs tracking-widest text-primary mb-1">
                    {member.ruolo}
                  </p>

                  {/* Name */}
                  <h3 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider text-foreground mb-1 group-hover:text-primary transition-colors">
                    {member.nome}
                  </h3>

                  {/* Italian label */}
                  <p className="text-xs text-muted/60 mb-3">{member.ruoloLabel}</p>

                  {/* Description */}
                  <p className="text-sm text-muted leading-relaxed mb-4">
                    {member.descrizione}
                  </p>

                  {/* Contact */}
                  <div className="flex items-center gap-3 text-xs">
                    {member.instagram && (
                      <a
                        href={`https://instagram.com/${member.instagram.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-pink-400 hover:text-pink-300 transition-colors"
                      >
                        <Instagram size={12} />
                        {member.instagram}
                      </a>
                    )}
                    {member.contatto && (
                      <a
                        href={`mailto:${member.contatto}`}
                        className="flex items-center gap-1 text-muted hover:text-primary transition-colors"
                      >
                        <Mail size={12} />
                        Contatta
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Join the crew CTA */}
          <div className="mt-10 p-6 sm:p-8 bg-surface/50 rounded-2xl border border-dashed border-primary/30 text-center">
            <h3 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-2">
              VUOI FAR PARTE DELLA CREW?
            </h3>
            <p className="text-muted text-sm max-w-lg mx-auto mb-4">
              Sei un professionista e vuoi entrare nel circuito?
              <br />
              Offri il tuo servizio alle tappe del Tour e sarai protagonista a The Finals.
              <br />
              Nessun costo per te - solo visibilita&apos; e opportunita&apos;.
            </p>
            <a
              href="mailto:romagnasummerhoopstour@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors"
            >
              <Mail size={18} />
              Candidati
            </a>
          </div>
        </div>

        {/* ===== SPONSOR SECTION ===== */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-gold rounded-full" />
            <h2 className="font-[family-name:var(--font-bebas)] text-4xl tracking-wider">
              SPONSOR
            </h2>
          </div>

          {/* Main Sponsor */}
          <div className="mb-12">
            <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider mb-4 text-gold">
              MAIN SPONSOR
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="p-12 bg-surface rounded-2xl border border-dashed border-gold/30 flex flex-col items-center justify-center text-center"
                >
                  <Star size={40} className="text-gold/20 mb-4" />
                  <p className="font-[family-name:var(--font-bebas)] text-xl tracking-wider text-muted/40">
                    IL TUO BRAND QUI
                  </p>
                  <p className="text-xs text-muted/30 mt-2">Main Sponsor</p>
                </div>
              ))}
            </div>
          </div>

          {/* Official Sponsors */}
          <div className="mb-12">
            <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider mb-4 text-primary">
              SPONSOR UFFICIALI
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-8 bg-surface rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center"
                >
                  <Star size={28} className="text-primary/15 mb-3" />
                  <p className="font-[family-name:var(--font-bebas)] text-sm tracking-wider text-muted/30">
                    SPONSOR
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Partners */}
          <div className="mb-12">
            <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider mb-4 text-accent">
              PARTNER TECNICI
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="p-6 bg-surface rounded-xl border border-dashed border-border flex items-center justify-center"
                >
                  <Star size={20} className="text-accent/15" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== BECOME SPONSOR CTA ===== */}
        <div className="p-8 sm:p-12 bg-gradient-to-r from-primary/10 to-gold/10 rounded-2xl border border-primary/20 text-center">
          <h2 className="font-[family-name:var(--font-bebas)] text-4xl tracking-wider mb-4">
            DIVENTA SPONSOR
          </h2>
          <p className="text-muted max-w-xl mx-auto mb-6">
            Associa il tuo brand a un evento innovativo che unisce sport, musica e street culture
            nella Riviera Romagnola. Visibilita&apos; su tutti i canali e a ogni tappa del Tour.
          </p>
          <a
            href="mailto:romagnasummerhoopstour@gmail.com"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors text-lg"
          >
            <Mail size={20} />
            Contattaci
          </a>
        </div>
      </div>
    </div>
  );
}
