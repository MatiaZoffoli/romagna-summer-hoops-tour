import Link from "next/link";
import { Trophy, MapPin } from "lucide-react";
import { getMvps } from "@/lib/data";

export const revalidate = 60;

export default async function MvpPage() {
  const mvps = await getMvps();

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">
          I protagonisti del Tour
        </p>
        <h1 className="font-[family-name:var(--font-bebas)] text-6xl sm:text-7xl tracking-wider mb-6">
          <span className="gradient-text">MVP</span>
          <span className="text-foreground"> DEL TOUR</span>
        </h1>
        <p className="text-lg text-muted mb-12">
          I migliori giocatori di ogni tappa. Foto, carriera e statistiche.
        </p>

        {mvps.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2">
            {mvps.map((mvp) => (
              <article
                key={mvp.id}
                className="p-6 bg-surface rounded-2xl border border-border overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  {mvp.photo_url ? (
                    <div className="shrink-0 w-32 h-32 rounded-xl overflow-hidden bg-background border border-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={mvp.photo_url}
                        alt={`${mvp.nome} ${mvp.cognome}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="shrink-0 w-32 h-32 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <Trophy size={40} className="text-primary/50" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider text-foreground">
                      {mvp.nome} {mvp.cognome}
                    </h2>
                    {mvp.tappe && (
                      <Link
                        href={`/tappe/${mvp.tappe.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-gold transition-colors mt-1"
                      >
                        <MapPin size={14} />
                        MVP — {mvp.tappe.nome} {mvp.tappe.data && `(${mvp.tappe.data})`}
                      </Link>
                    )}
                    {mvp.bio && (
                      <p className="text-sm text-muted mt-4 leading-relaxed">{mvp.bio}</p>
                    )}
                    {mvp.carriera && (
                      <div className="mt-4">
                        <p className="text-xs text-muted uppercase tracking-wider mb-1">Carriera</p>
                        <p className="text-sm text-foreground whitespace-pre-line">{mvp.carriera}</p>
                      </div>
                    )}
                    {mvp.stats && Object.keys(mvp.stats).length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        {Object.entries(mvp.stats).map(([key, value]) => (
                          <div key={key} className="px-3 py-1.5 bg-background rounded-lg border border-border text-sm">
                            <span className="text-muted">{key}:</span>{" "}
                            <span className="font-semibold text-foreground">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-muted">
            <Trophy size={48} className="mx-auto mb-4 text-primary/30" />
            <p className="text-lg">Nessun MVP ancora. Torna dopo le prime tappe!</p>
          </div>
        )}
      </div>
    </div>
  );
}
