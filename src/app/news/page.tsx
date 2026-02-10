import { Newspaper } from "lucide-react";
import { getNews } from "@/lib/data";

export const revalidate = 60;

export default async function NewsPage() {
  const newsItems = await getNews();

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">
            Aggiornamenti e Recap
          </p>
          <h1 className="font-[family-name:var(--font-bebas)] text-6xl sm:text-7xl tracking-wider mb-6">
            <span className="gradient-text">NEWS</span>
          </h1>
          <p className="text-lg text-muted">
            Tutte le novità dal mondo del Romagna Summer Hoops Tour.
          </p>
        </div>

        {/* News list */}
        <div className="space-y-8">
          {newsItems.map((n) => (
            <article
              key={n.id}
              id={n.id}
              className="p-8 bg-surface rounded-2xl border border-border scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-4">
                <Newspaper size={16} className="text-primary" />
                <span className="text-xs text-primary uppercase tracking-wider font-semibold">
                  {n.data}
                </span>
              </div>
              <h2 className="font-[family-name:var(--font-bebas)] text-3xl tracking-wider mb-4">
                {n.titolo}
              </h2>
              <p className="text-muted leading-relaxed">{n.contenuto}</p>
            </article>
          ))}
        </div>

        {/* More coming */}
        {newsItems.length === 0 && (
          <div className="p-12 bg-surface rounded-2xl border border-dashed border-border text-center">
            <Newspaper size={48} className="mx-auto mb-4 text-primary/30" />
            <p className="text-lg font-medium text-muted mb-2">
              Nessuna news ancora
            </p>
            <p className="text-sm text-muted/60">
              Le prime novità arriveranno presto. Resta sintonizzato!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
