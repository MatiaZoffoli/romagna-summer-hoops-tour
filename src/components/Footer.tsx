import Link from "next/link";
import { Instagram, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏀</span>
              <div className="flex flex-col leading-none">
                <span className="font-[family-name:var(--font-bebas)] text-lg tracking-wider text-primary">
                  ROMAGNA SUMMER
                </span>
                <span className="font-[family-name:var(--font-bebas)] text-xs tracking-widest text-foreground/80">
                  HOOPS TOUR
                </span>
              </div>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Il primo circuito estivo di basket 3x3 in Romagna.
              Canestri, musica e street culture.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-[family-name:var(--font-bebas)] text-lg tracking-wider text-foreground mb-4">
              IL TOUR
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/il-tour" className="text-muted hover:text-primary transition-colors">Come Funziona</Link></li>
              <li><Link href="/tappe" className="text-muted hover:text-primary transition-colors">Tappe</Link></li>
              <li><Link href="/classifica" className="text-muted hover:text-primary transition-colors">Classifica</Link></li>
              <li><Link href="/finals" className="text-muted hover:text-primary transition-colors">Finals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-[family-name:var(--font-bebas)] text-lg tracking-wider text-foreground mb-4">
              PARTECIPA
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/squadre" className="text-muted hover:text-primary transition-colors">Squadre</Link></li>
              <li><Link href="/registrazione" className="text-muted hover:text-primary transition-colors">Registra la tua Squadra</Link></li>
              <li><Link href="/contatti" className="text-muted hover:text-primary transition-colors">Diventa una Tappa</Link></li>
              <li><Link href="/sponsor" className="text-muted hover:text-primary transition-colors">Sponsor</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-[family-name:var(--font-bebas)] text-lg tracking-wider text-foreground mb-4">
              CONTATTI
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted">
                <MapPin size={16} className="text-primary shrink-0" />
                Romagna, Italia
              </li>
              <li>
                <a
                  href="mailto:romagnasummerhoopstour@gmail.com"
                  className="flex items-center gap-2 text-muted hover:text-primary transition-colors"
                >
                  <Mail size={16} className="text-primary shrink-0" />
                  romagnasummerhoopstour@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/romagnasummerhoopstour"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted hover:text-primary transition-colors"
                >
                  <Instagram size={16} className="text-primary shrink-0" />
                  @romagnasummerhoopstour
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted">
            &copy; 2026 Romagna Summer Hoops Tour. Tutti i diritti riservati.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse" />
            Stagione 2026
          </div>
        </div>
      </div>
    </footer>
  );
}
