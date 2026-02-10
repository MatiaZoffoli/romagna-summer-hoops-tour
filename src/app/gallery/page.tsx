import Link from "next/link";
import { Camera, Instagram, ExternalLink, Video, Image as ImageIcon } from "lucide-react";
import { getTappe } from "@/lib/data";

export const revalidate = 60;

export default async function GalleryPage() {
  const tappe = await getTappe();

  // Filter only tappe that have instagram links
  const tappeConInstagram = tappe.filter((t) => t.instagram);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-3">
            Foto e Video
          </p>
          <h1 className="font-[family-name:var(--font-bebas)] text-6xl sm:text-7xl tracking-wider mb-6">
            <span className="gradient-text">GALLERY</span>
          </h1>
          <p className="text-lg text-muted">
            Rivivi i momenti migliori del Romagna Summer Hoops Tour.
            Segui le pagine Instagram delle tappe per foto, video e highlight.
          </p>
        </div>

        {/* Main RSHT Instagram */}
        <div className="p-8 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-orange-500/10 rounded-2xl border border-pink-500/20 mb-12">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-orange-500 rounded-2xl flex items-center justify-center shrink-0">
              <Instagram size={36} className="text-white" />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h2 className="font-[family-name:var(--font-bebas)] text-3xl tracking-wider mb-2">
                ROMAGNA SUMMER HOOPS TOUR
              </h2>
              <p className="text-muted text-sm mb-3">
                Segui la pagina ufficiale del Tour per highlights, recap e contenuti esclusivi di ogni tappa.
              </p>
              <a
                href="https://instagram.com/romagnasummerhoopstour"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
              >
                <Instagram size={18} />
                @romagnasummerhoopstour
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Tappe Instagram sections */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="font-[family-name:var(--font-bebas)] text-3xl tracking-wider">
              PAGINE INSTAGRAM DELLE TAPPE
            </h2>
          </div>

          {tappeConInstagram.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tappeConInstagram.map((tappa) => (
                <a
                  key={tappa.id}
                  href={`https://instagram.com/${tappa.instagram?.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-6 bg-surface rounded-2xl border border-border hover:border-pink-400/40 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-pink-400/10 rounded-xl flex items-center justify-center">
                      <Instagram size={22} className="text-pink-400" />
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider group-hover:text-pink-400 transition-colors">
                        {tappa.nome}
                      </h3>
                      <p className="text-xs text-muted">{tappa.luogo}</p>
                    </div>
                  </div>
                  <p className="text-sm text-pink-400 flex items-center gap-1.5">
                    {tappa.instagram}
                    <ExternalLink size={12} />
                  </p>
                </a>
              ))}
            </div>
          ) : (
            <div className="p-8 bg-surface rounded-xl border border-dashed border-border text-center">
              <p className="text-muted">
                Le pagine Instagram delle tappe saranno aggiunte qui man mano che vengono confermate.
              </p>
            </div>
          )}
        </div>

        {/* Content types */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-accent rounded-full" />
            <h2 className="font-[family-name:var(--font-bebas)] text-3xl tracking-wider">
              COSA TROVERAI
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 bg-surface rounded-2xl border border-border text-center">
              <Camera size={32} className="text-primary mx-auto mb-4" />
              <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider mb-2">
                FOTO
              </h3>
              <p className="text-sm text-muted">
                Scatti professionali di ogni tappa - azioni, atmosfera e momenti speciali.
              </p>
            </div>
            <div className="p-6 bg-surface rounded-2xl border border-border text-center">
              <Video size={32} className="text-accent mx-auto mb-4" />
              <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider mb-2">
                HIGHLIGHTS
              </h3>
              <p className="text-sm text-muted">
                Video recap, highlight reel e migliori giocate da ogni torneo.
              </p>
            </div>
            <div className="p-6 bg-surface rounded-2xl border border-border text-center">
              <ImageIcon size={32} className="text-gold mx-auto mb-4" />
              <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider mb-2">
                STORIES
              </h3>
              <p className="text-sm text-muted">
                Dietro le quinte, interviste e contenuti esclusivi nelle stories.
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon notice */}
        <div className="p-8 bg-surface/50 rounded-2xl border border-dashed border-border text-center">
          <Camera size={48} className="mx-auto mb-4 text-primary/30" />
          <h3 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-2">
            GALLERY IN ARRIVO
          </h3>
          <p className="text-muted text-sm max-w-lg mx-auto">
            La gallery si riempirà con foto e video man mano che le tappe del Tour si svolgono.
            Segui le nostre pagine Instagram per non perdere nessun contenuto!
          </p>
        </div>
      </div>
    </div>
  );
}
