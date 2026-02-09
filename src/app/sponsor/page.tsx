import { Star, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

export default function SponsorPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">
            I Nostri Partner
          </p>
          <h1 className="font-[family-name:var(--font-bebas)] text-6xl sm:text-7xl tracking-wider mb-6">
            <span className="gradient-text">SPONSOR</span>
          </h1>
          <p className="text-lg text-muted">
            Il Romagna Summer Hoops Tour è reso possibile grazie ai nostri sponsor e partner.
            Vuoi unirti a noi? Contattaci!
          </p>
        </div>

        {/* Sponsor placeholders */}
        <div className="mb-16">
          <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-6 text-gold">
            MAIN SPONSOR
          </h2>
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

        <div className="mb-16">
          <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-6 text-primary">
            SPONSOR UFFICIALI
          </h2>
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

        <div className="mb-16">
          <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-6 text-accent">
            PARTNER TECNICI
          </h2>
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

        {/* CTA */}
        <div className="p-8 sm:p-12 bg-gradient-to-r from-primary/10 to-gold/10 rounded-2xl border border-primary/20 text-center">
          <h2 className="font-[family-name:var(--font-bebas)] text-4xl tracking-wider mb-4">
            DIVENTA SPONSOR
          </h2>
          <p className="text-muted max-w-xl mx-auto mb-6">
            Associa il tuo brand a un evento innovativo che unisce sport, musica e street culture
            nella Riviera Romagnola. Visibilità su tutti i canali e a ogni tappa del Tour.
          </p>
          <a
            href="mailto:sponsor@romagnahoopstour.it"
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
