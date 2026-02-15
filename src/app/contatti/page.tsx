import Link from "next/link";
import { Mail, Instagram, MapPin, Phone } from "lucide-react";

export default function ContattiPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">
            Parliamo
          </p>
          <h1 className="font-[family-name:var(--font-bebas)] text-6xl sm:text-7xl tracking-wider mb-6">
            <span className="gradient-text">CONTATTI</span>
          </h1>
          <p className="text-lg text-muted">
            Hai domande, proposte o vuoi far diventare il tuo torneo una tappa ufficiale?
            Scrivici!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact info */}
          <div className="space-y-6">
            <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider">
              INFO GENERALI
            </h2>

            <div className="space-y-4">
              <a
                href="mailto:romagnasummerhoopstour@gmail.com"
                className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-border hover:border-primary/40 transition-colors group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Mail size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted">Email</p>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    romagnasummerhoopstour@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="https://instagram.com/romagnasummerhoopstour"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-border hover:border-pink-400/40 transition-colors group"
              >
                <div className="w-12 h-12 bg-pink-400/10 rounded-xl flex items-center justify-center">
                  <Instagram size={20} className="text-pink-400" />
                </div>
                <div>
                  <p className="text-sm text-muted">Instagram</p>
                  <p className="font-medium text-foreground group-hover:text-pink-400 transition-colors">
                    @romagnasummerhoopstour
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 bg-surface rounded-xl border border-border">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <MapPin size={20} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted">Area</p>
                  <p className="font-medium text-foreground">
                    Romagna - Forli-Cesena, Rimini, Ravenna
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Become a tappa form */}
          <div>
            <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-6">
              DIVENTA UNA TAPPA
            </h2>

            <div className="p-8 bg-surface rounded-2xl border border-primary/20">
              <p className="text-muted mb-6 text-sm leading-relaxed">
                Organizzi un torneo 3x3 in Romagna? Compila il modulo per candidare il tuo
                torneo come tappa ufficiale del Romagna Summer Hoops Tour.
              </p>

              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 text-sm text-muted">
                  <span className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    1
                  </span>
                  <p>Mantieni il tuo nome, format e gestione operativa</p>
                </div>
                <div className="flex items-start gap-3 text-sm text-muted">
                  <span className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    2
                  </span>
                  <p>Le tue squadre entrano nella classifica generale</p>
                </div>
                <div className="flex items-start gap-3 text-sm text-muted">
                  <span className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                    3
                  </span>
                  <p>Più visibilità attraverso la rete del Tour</p>
                </div>
              </div>

              {/* Application form link */}
              <Link
                href="/diventa-tappa"
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors"
              >
                Candidati Ora
              </Link>
              <p className="text-xs text-muted/60 text-center mt-3">
                Compila il modulo di candidatura
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
