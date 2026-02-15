"use client";

import Image from "next/image";
import { MapPin, X } from "lucide-react";

export interface MvpPlaceholderTappa {
  nome: string;
  slug: string;
  data: string;
}

interface MvpPlaceholderModalProps {
  tappa: MvpPlaceholderTappa;
  onClose: () => void;
}

const PLACEHOLDER_IMAGE = "/images/mvp-placeholder.png";

export default function MvpPlaceholderModal({ tappa, onClose }: MvpPlaceholderModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mvp-placeholder-modal-title"
    >
      <div className="bg-surface rounded-2xl border border-border max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-background rounded-lg transition-colors z-10"
          aria-label="Chiudi"
        >
          <X size={20} />
        </button>

        {/* Portrait header: faded image with tournament info on top */}
        <div className="relative h-48 rounded-t-2xl overflow-hidden">
          <Image
            src={PLACEHOLDER_IMAGE}
            alt=""
            fill
            className="object-cover object-top opacity-45"
            sizes="512px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface from-40% via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h2 id="mvp-placeholder-modal-title" className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider text-white drop-shadow-md">
              MVP — In attesa della nomina
            </h2>
            <a
              href={`/tappe/${tappa.slug}`}
              className="inline-flex items-center gap-1.5 text-sm text-white/90 hover:text-primary transition-colors mt-1 drop-shadow"
            >
              <MapPin size={14} />
              {tappa.nome} {tappa.data && `(${tappa.data})`}
            </a>
          </div>
        </div>

        {/* Stats and details (only in popup) */}
        <div className="p-6">
          <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider mb-1">Nome e cognome</p>
                  <p className="text-sm text-muted">—</p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider mb-1">Bio</p>
                  <p className="text-sm text-muted">In attesa della nomina.</p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase tracking-wider mb-1">Carriera</p>
                  <p className="text-sm text-muted">—</p>
                </div>
            <div>
              <p className="text-xs text-muted uppercase tracking-wider mb-1">Statistiche</p>
              <p className="text-sm text-muted">Statistiche in arrivo.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
