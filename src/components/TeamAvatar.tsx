"use client";

import {
  Circle,
  Trophy,
  Flame,
  Star,
  Crosshair,
  Award,
  Zap,
  Shield,
  CircleDot,
  Medal,
  Crown,
  Mountain,
  type LucideIcon,
} from "lucide-react";
import Jdenticon from "react-jdenticon";
import { AVATAR_ICON_OPTIONS, getAvatarColorHex } from "@/lib/avatar-presets";

const ICON_MAP: Record<string, LucideIcon> = {
  basketball: Circle,
  trophy: Trophy,
  flame: Flame,
  star: Star,
  target: Crosshair,
  award: Award,
  zap: Zap,
  shield: Shield,
  "circle-dot": CircleDot,
  medal: Medal,
  crown: Crown,
  mountain: Mountain,
};

export interface TeamAvatarSquadra {
  id: string;
  nome: string;
  logo_url?: string | null;
  avatar_icon?: string | null;
  avatar_color?: string | null;
  generated_logo_url?: string | null;
}

interface TeamAvatarProps {
  squadra: TeamAvatarSquadra;
  size?: "sm" | "md";
  className?: string;
}

const sizeClasses = {
  sm: "w-16 h-16",
  md: "w-20 h-20",
};

export default function TeamAvatar({ squadra, size = "md", className = "" }: TeamAvatarProps) {
  const boxClass = `rounded-xl flex items-center justify-center shrink-0 overflow-hidden ${sizeClasses[size]} ${className}`;

  if (squadra.logo_url?.trim()) {
    return (
      <div className={`${boxClass} bg-surface border border-border`}>
        <img
          src={squadra.logo_url}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const iconId = squadra.avatar_icon?.trim();
  const colorHex = getAvatarColorHex(squadra.avatar_color) ?? "#1a1a2e";
  const IconComponent = iconId ? ICON_MAP[iconId] : null;

  if (IconComponent) {
    return (
      <div
        className={`${boxClass} border border-white/10`}
        style={{ backgroundColor: colorHex }}
      >
        <IconComponent size={size === "sm" ? 28 : 36} className="text-white" />
      </div>
    );
  }

  return (
    <div className={`${boxClass} bg-primary/10 border border-primary/30`}>
      <Jdenticon value={squadra.id} size={size === "sm" ? 64 : 80} />
    </div>
  );
}
