"use client";

import { useEffect, useState } from "react";
import { Instagram, ExternalLink } from "lucide-react";
import type { DbTappa } from "@/lib/types";

const CARD_MAX_WIDTH = 480; // larger cards, photo-focused
const ASPECT_RATIO = 1; // 1:1

function getEmbedIframeUrl(postUrl: string): string | null {
  try {
    const u = new URL(postUrl);
    if (!/^(www\.)?instagram\.com$/i.test(u.hostname)) return null;
    const m = u.pathname.match(/^\/(p|reel)\/([A-Za-z0-9_-]+)\/?$/);
    if (!m) return null;
    return `https://www.instagram.com/${m[1]}/${m[2]}/embed/`;
  } catch {
    return null;
  }
}

function InstagramImageCard({ url }: { url: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const embedUrl = getEmbedIframeUrl(url);

  useEffect(() => {
    let cancelled = false;

    function setImage(src: string) {
      if (!cancelled) setImageUrl(src);
    }

    function onFail() {
      if (!cancelled) setFailed(true);
    }

    const params = new URLSearchParams({ url });

    fetch(`/api/instagram-oembed?${params.toString()}`)
      .then((res) => res.ok ? res.json() : Promise.reject(new Error("oEmbed failed")))
      .then((data: { thumbnail_url?: string }) => {
        if (cancelled) return;
        if (data?.thumbnail_url) {
          setImage(data.thumbnail_url);
          return;
        }
        return fetch(`/api/instagram-image?${params.toString()}`)
          .then((r) => r.ok ? r.json() : Promise.reject(new Error("No image")))
          .then((data: { imageUrl?: string }) => {
            if (cancelled) return;
            if (data?.imageUrl) setImage(data.imageUrl);
            else onFail();
          });
      })
      .catch(() => {
        if (cancelled) return;
        fetch(`/api/instagram-image?${params.toString()}`)
          .then((r) => r.ok ? r.json() : Promise.reject(new Error("No image")))
          .then((data: { imageUrl?: string }) => {
            if (cancelled) return;
            if (data?.imageUrl) setImage(data.imageUrl);
            else onFail();
          })
          .catch(() => onFail());
      });

    return () => { cancelled = true; };
  }, [url]);

  if (failed) {
    if (embedUrl) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center w-full rounded-xl border border-border bg-surface hover:bg-surface/90 transition-colors gap-3 p-6"
          style={{ maxWidth: CARD_MAX_WIDTH, aspectRatio: String(ASPECT_RATIO) }}
        >
          <Instagram className="text-muted-foreground" size={40} />
          <span className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Apri su Instagram
          </span>
        </a>
      );
    }
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-full rounded-xl border border-dashed border-border bg-surface text-muted text-sm p-6 hover:text-primary transition-colors"
        style={{ maxWidth: CARD_MAX_WIDTH, aspectRatio: String(ASPECT_RATIO) }}
      >
        Post non disponibile · Apri su Instagram
      </a>
    );
  }

  if (!imageUrl) {
    return (
      <div
        className="flex items-center justify-center w-full rounded-xl border border-border bg-surface animate-pulse"
        style={{ maxWidth: CARD_MAX_WIDTH, aspectRatio: String(ASPECT_RATIO) }}
      >
        <span className="text-muted text-sm">Caricamento...</span>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full rounded-xl border border-border overflow-hidden bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
      style={{ maxWidth: CARD_MAX_WIDTH, aspectRatio: String(ASPECT_RATIO) }}
    >
      <div className="relative w-full h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt=""
          className="w-full h-full object-cover brightness-105 contrast-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 text-gray-900 text-sm font-medium">
            <Instagram size={18} />
            View on Instagram
            <ExternalLink size={14} />
          </span>
        </div>
      </div>
    </a>
  );
}

export interface TappaWithPhotos {
  tappa: DbTappa;
  postUrls: string[];
}

export default function GalleryTappaEmbeds({ items }: { items: TappaWithPhotos[] }) {
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {postUrls.map((url) => (
              <InstagramImageCard key={url} url={url} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
