import Link from "next/link";
import { Shield, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Torna alla home
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={24} className="text-primary" />
            <h1 className="font-[family-name:var(--font-bebas)] text-5xl tracking-wider">
              PRIVACY POLICY
            </h1>
          </div>
          <p className="text-sm text-muted">
            Ultimo aggiornamento: Febbraio 2026
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none space-y-8">
          <section className="p-6 bg-surface rounded-2xl border border-border">
            <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-4 text-foreground">
              1. TITOLARE DEL TRATTAMENTO
            </h2>
            <p className="text-muted leading-relaxed text-sm">
              Il titolare del trattamento dei dati personali e&apos; il Romagna Summer Hoops Tour
              (di seguito &quot;RSHT&quot; o &quot;il Tour&quot;).
              Per qualsiasi informazione relativa al trattamento dei dati personali e&apos; possibile
              contattarci all&apos;indirizzo email: romagnasummerhoopstour@gmail.com
            </p>
          </section>

          <section className="p-6 bg-surface rounded-2xl border border-border">
            <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-4 text-foreground">
              2. DATI RACCOLTI
            </h2>
            <p className="text-muted leading-relaxed text-sm mb-3">
              Attraverso la registrazione al sito raccogliamo i seguenti dati personali:
            </p>
            <ul className="space-y-2 text-muted text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong className="text-foreground">Dati della squadra:</strong> nome squadra, motto, account Instagram della squadra</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong className="text-foreground">Dati di contatto:</strong> email, numero di telefono del referente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong className="text-foreground">Dati dei giocatori:</strong> nome, cognome, ruolo, account Instagram</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span><strong className="text-foreground">Dati di accesso:</strong> email e password (la password e&apos; criptata e non accessibile)</span>
              </li>
            </ul>
          </section>

          <section className="p-6 bg-surface rounded-2xl border border-border">
            <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-4 text-foreground">
              3. FINALITA&apos; DEL TRATTAMENTO
            </h2>
            <p className="text-muted leading-relaxed text-sm mb-3">
              I dati personali sono trattati per le seguenti finalita&apos;:
            </p>
            <ul className="space-y-2 text-muted text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Gestione della registrazione e del profilo squadra sul sito web</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Pubblicazione dei profili squadra e dei giocatori sul sito web (visibilita&apos; pubblica)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Gestione della classifica generale e dei risultati delle tappe</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Condivisione dei dati con gli organizzatori delle tappe ai fini dell&apos;organizzazione dei tornei</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Comunicazioni relative al Tour e ad eventi futuri</span>
              </li>
            </ul>
          </section>

          <section className="p-6 bg-surface rounded-2xl border border-border">
            <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-4 text-foreground">
              4. VISIBILITA&apos; DEI DATI
            </h2>
            <p className="text-muted leading-relaxed text-sm">
              Registrandosi al sito, l&apos;utente accetta che i seguenti dati siano visibili
              pubblicamente: nome squadra, motto, Instagram squadra, nomi dei giocatori,
              cognomi, ruoli e account Instagram. I dati di contatto (email e telefono) non
              sono visibili pubblicamente ma possono essere condivisi con gli organizzatori
              delle tappe per finalita&apos; organizzative.
            </p>
          </section>

          <section className="p-6 bg-surface rounded-2xl border border-border">
            <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-4 text-foreground">
              5. CONSERVAZIONE DEI DATI
            </h2>
            <p className="text-muted leading-relaxed text-sm">
              I dati personali saranno conservati per la durata della stagione del Tour e
              per un periodo ragionevole successivo, salvo diversa richiesta dell&apos;utente.
              I dati sono conservati su server sicuri forniti da Supabase (infrastruttura AWS).
            </p>
          </section>

          <section className="p-6 bg-surface rounded-2xl border border-border">
            <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-4 text-foreground">
              6. DIRITTI DELL&apos;UTENTE
            </h2>
            <p className="text-muted leading-relaxed text-sm mb-3">
              In qualsiasi momento e&apos; possibile:
            </p>
            <ul className="space-y-2 text-muted text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Accedere ai propri dati personali attraverso la dashboard del profilo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Modificare i propri dati attraverso la dashboard del profilo</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Richiedere la cancellazione del proprio account e dei dati associati contattandoci via email</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Richiedere informazioni sul trattamento dei propri dati</span>
              </li>
            </ul>
          </section>

          <section className="p-6 bg-surface rounded-2xl border border-border">
            <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-4 text-foreground">
              7. CONTATTI
            </h2>
            <p className="text-muted leading-relaxed text-sm">
              Per esercitare i propri diritti o per qualsiasi domanda relativa alla privacy,
              contattare:{" "}
              <a href="mailto:romagnasummerhoopstour@gmail.com" className="text-primary hover:text-gold transition-colors">
                romagnasummerhoopstour@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
