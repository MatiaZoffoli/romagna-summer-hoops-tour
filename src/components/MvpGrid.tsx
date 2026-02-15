"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Trophy, MapPin, Sparkles } from "lucide-react";
import type { MvpConTappa } from "@/lib/data";
import MvpPlaceholderCard from "./MvpPlaceholderCard";
import MvpPlaceholderModal from "./MvpPlaceholderModal";

const TEASER_IMAGE = "/images/mvp-placeholder.png";

function MvpPlaceholderTeaserCard() {
  return (
    <div className="relative aspect-[2/3] min-h-[140px] rounded-xl border border-border border-dashed overflow-hidden text-left flex items-center justify-center">
      <div className="absolute inset-0">
        <Image
          src={TEASER_IMAGE}
          alt=""
          fill
          className="object-cover opacity-25 blur-md scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="relative z-10 px-3 py-4 text-center">
        <Sparkles size={20} className="mx-auto text-white/60 mb-2" />
        <p className="text-xs font-medium text-white/90 drop-shadow-md leading-snug">
          Altri MVP in arrivo
        </p>
        <p className="text-[10px] text-white/70 mt-1 leading-snug">
          Chi sarrano i migliori delle tappe future?
        </p>
      </div>
    </div>
  );
}

export interface MvpSlotTappa {
  id: string;
  nome: string;
  slug: string;
  data: string;
}

export type MvpSlot =
  | { type: "mvp"; tappa: MvpSlotTappa; mvp: MvpConTappa }
  | { type: "placeholder"; tappa: MvpSlotTappa };

interface MvpGridProps {
  slots: MvpSlot[];
}

export default function MvpGrid({ slots }: MvpGridProps) {
  const [selectedPlaceholder, setSelectedPlaceholder] = useState<MvpSlotTappa | null>(null);

  if (slots.length === 0) {
    return (
      <div className="py-16 text-center text-muted">
        <Trophy size={48} className="mx-auto mb-4 text-primary/30" />
        <p className="text-lg">Nessuna tappa in programma ancora. Torna dopo per vedere gli MVP!</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {slots.map((slot, index) => {
          if (slot.type === "mvp") {
            const { mvp } = slot;
            return (
              <article
                key={mvp.id}
                className="sm:col-span-2 p-6 bg-surface rounded-2xl border border-border overflow-hidden"
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
                          <div
                            key={key}
                            className="px-3 py-1.5 bg-background rounded-lg border border-border text-sm"
                          >
                            <span className="text-muted">{key}:</span>{" "}
                            <span className="font-semibold text-foreground">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          }
          return (
            <MvpPlaceholderCard
              key={`placeholder-${slot.tappa.id}`}
              tappa={slot.tappa}
              onClick={() => setSelectedPlaceholder(slot.tappa)}
            />
          );
        })}
        {/* Teaser: more MVPs as more tappe are confirmed */}
        <MvpPlaceholderTeaserCard />
      </div>

      {selectedPlaceholder && (
        <MvpPlaceholderModal
          tappa={selectedPlaceholder}
          onClose={() => setSelectedPlaceholder(null)}
        />
      )}
    </>
  );
}
