import Link from "next/link";
import { Calendar, Trophy, MapPin, Users, ArrowRight, Star, Flame } from "lucide-react";
import { getTappe, getSquadreConPunti, getNews } from "@/lib/data";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const [tappe, squadre, newsItems] = await Promise.all([
    getTappe(),
    getSquadreConPunti(),
    getNews(),
  ]);

  const prossimaTappa = tappe.find(
    (t) => t.stato === "confermata" || t.stato === "in_corso"
  );
  const topSquadre = [...squadre]
    .sort((a, b) => b.punti_totali - a.punti_totali)
    .slice(0, 5);

  return (
    <div className="pt-16">
      {/* ===== HERO ===== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,107,53,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(0,212,255,0.1),transparent_50%)]" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-medium mb-8 animate-fade-in-up">
            <Flame size={16} />
            Stagione 2026 - Iscrizioni Aperte
          </div>

          {/* Main title */}
          <h1 className="font-[family-name:var(--font-bebas)] text-6xl sm:text-8xl md:text-9xl leading-none tracking-wider mb-6 animate-fade-in-up">
            <span className="text-foreground">ROMAGNA</span>
            <br />
            <span className="gradient-text">SUMMER HOOPS</span>
            <br />
            <span className="text-foreground">TOUR</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-muted max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Il primo circuito estivo di basket 3x3 in Romagna.
            <br className="hidden sm:block" />
            Canestri, musica e street culture - da Maggio a Settembre.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Link
              href="/registrazione"
              className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-all hover:scale-105 animate-pulse-glow flex items-center gap-2 text-lg"
            >
              Registra la tua Squadra
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/il-tour"
              className="px-8 py-4 border border-foreground/20 text-foreground rounded-full hover:border-primary hover:text-primary transition-colors flex items-center gap-2"
            >
              Scopri il Tour
            </Link>
          </div>

          {/* Category badges */}
          <div className="flex items-center justify-center gap-3 mt-8 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <span className="px-4 py-1.5 bg-primary/20 border border-primary/40 rounded-full text-xs font-semibold text-primary">
              MASCHILE 16+
            </span>
            <span className="px-4 py-1.5 bg-surface border border-border rounded-full text-xs text-muted/50 coming-soon">
              UNDER 16 - Coming Soon
            </span>
            <span className="px-4 py-1.5 bg-surface border border-border rounded-full text-xs text-muted/50 coming-soon">
              FEMMINILE - Coming Soon
            </span>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="bg-surface border-y border-border py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: "Tappe", value: `${tappe.length}+`, icon: MapPin },
            { label: "Province", value: "3", icon: MapPin },
            { label: "Mesi di Gare", value: "Maggio - Settembre", icon: Calendar },
            { label: "Squadre Iscritte", value: `${squadre.length}+`, icon: Users },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <stat.icon size={20} className="text-primary mb-1" />
              <span className="font-[family-name:var(--font-bebas)] text-3xl tracking-wider text-foreground">
                {stat.value}
              </span>
              <span className="text-xs text-muted uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PROSSIMA TAPPA ===== */}
      {prossimaTappa && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-primary rounded-full" />
              <h2 className="font-[family-name:var(--font-bebas)] text-4xl tracking-wider">
                PROSSIMA TAPPA
              </h2>
            </div>

            <Link href={`/tappe/${prossimaTappa.slug}`}>
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface via-surface to-secondary border border-border hover:border-primary/50 transition-all group p-8 sm:p-12">
                <div className="absolute top-4 right-4 px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full border border-primary/30">
                  PROSSIMA
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <p className="text-primary font-semibold text-sm mb-2 uppercase tracking-wider">
                      {prossimaTappa.data} · {prossimaTappa.orario}
                    </p>
                    <h3 className="font-[family-name:var(--font-bebas)] text-5xl sm:text-6xl tracking-wider text-foreground group-hover:text-primary transition-colors mb-3">
                      {prossimaTappa.nome}
                    </h3>
                    <p className="text-muted text-sm mb-2">
                      Tappa ufficiale del Romagna Summer Hoops Tour
                    </p>
                    <div className="flex items-center gap-2 text-muted">
                      <MapPin size={16} className="text-accent" />
                      {prossimaTappa.luogo}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-primary font-semibold group-hover:gap-4 transition-all">
                    Scopri di più
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ===== COME FUNZIONA ===== */}
      <section className="py-20 px-4 bg-surface/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-1 h-8 bg-accent rounded-full" />
            <h2 className="font-[family-name:var(--font-bebas)] text-4xl tracking-wider">
              COME FUNZIONA
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "ISCRIVITI AI TORNEI",
                desc: "Registra la tua squadra e partecipa alle tappe del Tour. Ogni torneo è gestito autonomamente dai suoi organizzatori.",
                icon: Users,
              },
              {
                step: "02",
                title: "ACCUMULA PUNTI",
                desc: "Ogni piazzamento assegna punti. Le serie di tappe consecutive danno bonus: 10 pt × numero di tappe di fila (es. 2 di fila = 20 pt, 3 = 30 pt).",
                icon: Star,
              },
              {
                step: "03",
                title: "CONQUISTA THE FINALS",
                desc: "Le top 16 squadre della classifica generale si sfidano nell'evento finale dell'estate. Chi sarà il campione?",
                icon: Trophy,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative p-8 bg-surface rounded-2xl border border-border hover:border-primary/30 transition-colors group"
              >
                <span className="font-[family-name:var(--font-bebas)] text-6xl text-primary/10 absolute top-4 right-6">
                  {item.step}
                </span>
                <item.icon size={32} className="text-primary mb-4" />
                <h3 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/il-tour"
              className="inline-flex items-center gap-2 text-primary hover:text-gold transition-colors font-medium"
            >
              Regolamento completo
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CLASSIFICA PREVIEW ===== */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-gold rounded-full" />
              <h2 className="font-[family-name:var(--font-bebas)] text-4xl tracking-wider">
                CLASSIFICA
              </h2>
            </div>
            <Link
              href="/classifica"
              className="text-sm text-primary hover:text-gold transition-colors flex items-center gap-1"
            >
              Vedi completa <ArrowRight size={16} />
            </Link>
          </div>

          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <div className="grid grid-cols-[60px_1fr_100px] sm:grid-cols-[60px_1fr_120px_120px] items-center px-6 py-3 border-b border-border text-xs text-muted uppercase tracking-wider">
              <span>#</span>
              <span>Squadra</span>
              <span className="hidden sm:block text-right">Tappe</span>
              <span className="text-right">Punti</span>
            </div>
            {topSquadre.length > 0 ? (
              topSquadre.map((sq, i) => (
                <div
                  key={sq.id}
                  className="grid grid-cols-[60px_1fr_100px] sm:grid-cols-[60px_1fr_120px_120px] items-center px-6 py-4 border-b border-border/50 hover:bg-surface-light transition-colors"
                >
                  <span
                    className={`font-[family-name:var(--font-bebas)] text-2xl ${
                      i === 0
                        ? "text-gold"
                        : i === 1
                        ? "text-gray-400"
                        : i === 2
                        ? "text-orange-600"
                        : "text-muted"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="font-semibold text-foreground">{sq.nome}</span>
                  <span className="hidden sm:block text-right text-muted">
                    {sq.tappe_giocate}
                  </span>
                  <span className="text-right font-[family-name:var(--font-bebas)] text-xl text-primary">
                    {sq.punti_totali}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-muted">
                La classifica verrà aggiornata dopo la prima tappa.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ===== NEWS ===== */}
      <section className="py-20 px-4 bg-surface/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-accent rounded-full" />
              <h2 className="font-[family-name:var(--font-bebas)] text-4xl tracking-wider">
                ULTIME NEWS
              </h2>
            </div>
            <Link
              href="/news"
              className="text-sm text-primary hover:text-gold transition-colors flex items-center gap-1"
            >
              Tutte le news <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {newsItems.slice(0, 2).map((n) => (
              <Link key={n.id} href={`/news#${n.id}`}>
                <div className="overflow-hidden bg-surface rounded-2xl border border-border hover:border-primary/30 transition-all group h-full">
                  {n.image_url && (
                    <div className="relative w-full aspect-video bg-muted/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={n.image_url} alt="" className="object-cover w-full h-full" />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-xs text-primary mb-2 uppercase tracking-wider">
                      {n.data}
                    </p>
                    <h3 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-3 group-hover:text-primary transition-colors">
                      {n.titolo}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed">{n.anteprima}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DIVENTA TAPPA CTA ===== */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-bebas)] text-5xl sm:text-6xl tracking-wider mb-6">
            <span className="text-foreground">ORGANIZZI UN TORNEO 3X3?</span>
            <br />
            <span className="gradient-text">UNISCITI AL TOUR.</span>
          </h2>
          <p className="text-muted max-w-xl mx-auto mb-8">
            Fai diventare il tuo torneo una tappa ufficiale del Romagna Summer Hoops Tour.
            Più visibilità, più squadre, un&apos;estate da protagonisti.
          </p>
          <Link
            href="/contatti"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-all hover:scale-105 text-lg"
          >
            Diventa una Tappa
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
