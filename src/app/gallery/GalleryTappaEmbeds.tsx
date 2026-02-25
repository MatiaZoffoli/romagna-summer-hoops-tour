"use client";

import { useEffect, useRef, useState } from "react";
import { Instagram, ExternalLink } from "lucide-react";
import type { DbTappa } from "@/lib/types";

const EMBED_SCRIPT_URL = "https://www.instagram.com/embed.js";

function InstagramPostEmbed({ url }: { url: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams({ url });
    fetch(`/api/instagram-oembed?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("oEmbed failed");
        return res.json();
      })
      .then((data: { html?: string }) => {
        if (cancelled) return;
        if (data?.html) setHtml(data.html);
        else setError(true);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => { cancelled = true; };
  }, [url]);

  useProcessInstagramEmbeds(html);

  if (error) {
    return (
      <div className="flex items-center justify-center aspect-square max-w-[320px] w-full bg-surface rounded-xl border border-dashed border-border text-muted text-sm">
        <a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
          Post non disponibile · Apri su Instagram
        </a>
      </div>
    );
  }

  if (!html) {
    return (
      <div className="flex items-center justify-center aspect-square max-w-[320px] w-full bg-surface rounded-xl border border-border animate-pulse">
        <span className="text-muted text-sm">Caricamento...</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="instagram-embed-wrapper [&_.instagram-media]:max-w-full [&_.instagram-media]:min-w-0"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function useProcessInstagramEmbeds(html: string | null) {
  useEffect(() => {
    if (!html) return;
    const t = setTimeout(() => {
      if (typeof window !== "undefined" && (window as unknown as { instgrm?: { Embeds?: { process: () => void } } }).instgrm?.Embeds?.process) {
        (window as unknown as { instgrm: { Embeds: { process: () => void } } }).instgrm.Embeds.process();
      }
    }, 100);
    return () => clearTimeout(t);
  }, [html]);
}

/** Load Instagram embed.js once so blockquotes become iframes */
function useInstagramEmbedScript() {
  const loaded = useRef(false);
  useEffect(() => {
    if (loaded.current) return;
    if (typeof document === "undefined") return;
    const existing = document.querySelector(`script[src="${EMBED_SCRIPT_URL}"]`);
    if (existing) {
      loaded.current = true;
      return;
    }
    const script = document.createElement("script");
    script.src = EMBED_SCRIPT_URL;
    script.async = true;
    document.body.appendChild(script);
    loaded.current = true;
  }, []);
}

export interface TappaWithPhotos {
  tappa: DbTappa;
  postUrls: string[];
}

export default function GalleryTappaEmbeds({ items }: { items: TappaWithPhotos[] }) {
  useInstagramEmbedScript();

  if (items.length === 0) return null;

  return (
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {postUrls.map((url) => (
              <InstagramPostEmbed key={url} url={url} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
