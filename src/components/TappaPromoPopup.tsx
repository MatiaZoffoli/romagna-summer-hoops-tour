"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { X, MapPin, Calendar } from "lucide-react";
import type { DbTappa } from "@/lib/types";

const DISMISS_KEY_PREFIX = "tappa-promo-dismissed-";

interface TappaPromoPopupProps {
  tappa: DbTappa | null;
}

export default function TappaPromoPopup({ tappa }: TappaPromoPopupProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!tappa) return;
    const key = DISMISS_KEY_PREFIX + tappa.id;
    try {
      if (typeof window !== "undefined" && window.localStorage.getItem(key) === "1") {
        setOpen(false);
        return;
      }
    } catch {
      // ignore
    }
    setOpen(true);
  }, [tappa?.id]);

  const handleClose = () => {
    setOpen(false);
    if (tappa) {
      try {
        window.localStorage.setItem(DISMISS_KEY_PREFIX + tappa.id, "1");
      } catch {
        // ignore
      }
    }
  };

  if (!tappa || !open) return null;

  const tappaUrl = `/tappe/${tappa.slug}`;
  const contactUrl = tappa.contatto_organizzatore?.includes("@")
    ? `mailto:${tappa.contatto_organizzatore}`
    : tappaUrl;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tappa-promo-title"
    >
      <div className="bg-surface rounded-2xl border border-border max-w-md w-full p-6 shadow-xl relative">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-background rounded-lg transition-colors"
          aria-label="Chiudi"
        >
          <X size={20} />
        </button>

        <div className="pr-8">
          <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-2">
            Prossima tappa
          </p>
          <h2 id="tappa-promo-title" className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-4">
            {tappa.nome_completo || tappa.nome}
          </h2>
          <div className="flex flex-col gap-2 text-sm text-muted mb-6">
            <span className="flex items-center gap-2">
              <Calendar size={14} />
              {tappa.data} {tappa.orario && `• ${tappa.orario}`}
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={14} />
              {tappa.luogo}
              {tappa.indirizzo && ` — ${tappa.indirizzo}`}
            </span>
          </div>

          <p className="text-foreground font-medium mb-2">
            Hai già iscritto la tua squadra?
          </p>
          <p className="text-sm text-muted mb-6">
            Iscriviti contattando gli organizzatori. Non perdere l&apos;appuntamento!
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={tappaUrl}
              className="flex-1 px-4 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors text-center text-sm"
            >
              Vedi tappa
            </Link>
            <a
              href={contactUrl}
              className="flex-1 px-4 py-3 border border-primary text-primary font-semibold rounded-full hover:bg-primary/10 transition-colors text-center text-sm"
            >
              Contatta organizzatori
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
