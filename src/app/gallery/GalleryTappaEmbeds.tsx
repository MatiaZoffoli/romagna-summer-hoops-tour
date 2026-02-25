import { Instagram, ExternalLink } from "lucide-react";
import type { DbTappa } from "@/lib/types";
import InstagramEmbedScript from "./InstagramEmbedScript";

export interface TappaWithPhotos {
  tappa: DbTappa;
  postUrls: string[];
}

export default function GalleryTappaEmbeds({ items }: { items: TappaWithPhotos[] }) {
  if (items.length === 0) return null;

  return (
    <>
      <div className="space-y-12">
        {items.map(({ tappa, postUrls }) => (
          <section key={tappa.id}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-primary rounded-full" />
              <div className="flex-1">
                <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider">
                  {tappa.nome}
                </h2>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {postUrls.map((url) => (
                <div key={url} className="flex justify-center [&_.instagram-media]:max-w-full [&_.instagram-media]:!w-[min(100%,540px)]">
                  <blockquote
                    className="instagram-media"
                    data-instgrm-permalink={url}
                    data-instgrm-version="14"
                    style={{
                      background: "#FFF",
                      border: 0,
                      borderRadius: "3px",
                      boxShadow: "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
                      margin: "1px",
                      maxWidth: "540px",
                      minWidth: "326px",
                      padding: 0,
                      width: "99.375%",
                    }}
                  >
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      View this post on Instagram
                    </a>
                  </blockquote>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <InstagramEmbedScript />
    </>
  );
}
