import { Instagram, ExternalLink } from "lucide-react";
import type { DbTappa } from "@/lib/types";

export interface TappaWithGalleryImages {
  tappa: DbTappa;
  imageUrls: string[];
}

export default function GalleryTappaImages({ items }: { items: TappaWithGalleryImages[] }) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-12">
      {items.map(({ tappa, imageUrls }) => (
        <section key={tappa.id}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <div className="flex-1">
              <h3 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider">
                {tappa.nome}
              </h3>
              {tappa.instagram && (
                <a
                  href={`https://instagram.com/${tappa.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-pink-400 hover:text-pink-300 transition-colors mt-1"
                >
                  <Instagram size={14} />
                  {tappa.instagram}
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {imageUrls.map((url) => (
              <div
                key={url}
                className="aspect-square w-full max-w-sm mx-auto sm:mx-0 rounded-xl border border-border overflow-hidden bg-surface"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
