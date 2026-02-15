"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";

export interface MvpPlaceholderCardTappa {
  nome: string;
  slug: string;
  data: string;
}

interface MvpPlaceholderCardProps {
  tappa: MvpPlaceholderCardTappa;
  onClick: () => void;
}

const PLACEHOLDER_IMAGE = "/images/mvp-placeholder.png";

export default function MvpPlaceholderCard({ tappa, onClick }: MvpPlaceholderCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onClick())}
      className="relative aspect-[2/3] min-h-[140px] rounded-xl border border-border border-dashed overflow-hidden cursor-pointer hover:border-primary/50 transition-colors text-left group"
    >
      {/* Faded portrait background */}
      <div className="absolute inset-0">
        <Image
          src={PLACEHOLDER_IMAGE}
          alt=""
          fill
          className="object-cover opacity-50 group-hover:opacity-60 transition-opacity"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
      </div>

      {/* Tournament info on top */}
      <div className="absolute inset-0 flex flex-col justify-end p-3">
        <h2 className="font-[family-name:var(--font-bebas)] text-lg sm:text-xl tracking-wider text-white drop-shadow-md">
          MVP di {tappa.nome}
        </h2>
        <Link
          href={`/tappe/${tappa.slug}`}
          className="inline-flex items-center gap-1 text-xs text-white/90 hover:text-primary transition-colors mt-1 drop-shadow"
          onClick={(e) => e.stopPropagation()}
        >
          <MapPin size={12} />
          {tappa.nome}
          {tappa.data && ` · ${tappa.data}`}
        </Link>
        <p className="text-[10px] text-white/70 mt-1">In attesa della nomina</p>
      </div>
    </article>
  );
}
