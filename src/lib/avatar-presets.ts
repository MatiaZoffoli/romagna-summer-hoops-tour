/**
 * Preset options for team avatar (icon + color).
 * Used by TeamAvatar component and dashboard "Personalizza quadrato".
 */

export const AVATAR_ICON_OPTIONS: { id: string; label: string }[] = [
  { id: "basketball", label: "Pallacanestro" },
  { id: "trophy", label: "Trofeo" },
  { id: "flame", label: "Fiamma" },
  { id: "star", label: "Stella" },
  { id: "target", label: "Bersaglio" },
  { id: "award", label: "Premio" },
  { id: "zap", label: "Fulmine" },
  { id: "shield", label: "Scudo" },
  { id: "circle-dot", label: "Centro" },
  { id: "medal", label: "Medaglia" },
  { id: "crown", label: "Corona" },
  { id: "mountain", label: "Montagna" },
];

export const AVATAR_COLOR_OPTIONS: { id: string; label: string; hex: string }[] = [
  { id: "primary", label: "Arancione", hex: "#FF6B35" },
  { id: "accent", label: "Blu", hex: "#3B82F6" },
  { id: "gold", label: "Oro", hex: "#EAB308" },
  { id: "green", label: "Verde", hex: "#22C55E" },
  { id: "purple", label: "Viola", hex: "#A855F7" },
  { id: "pink", label: "Rosa", hex: "#EC4899" },
  { id: "red", label: "Rosso", hex: "#EF4444" },
  { id: "teal", label: "Teal", hex: "#14B8A6" },
  { id: "amber", label: "Ambra", hex: "#F59E0B" },
  { id: "indigo", label: "Indaco", hex: "#6366F1" },
  { id: "slate", label: "Grigio", hex: "#64748B" },
  { id: "emerald", label: "Smeraldo", hex: "#10B981" },
];

export function getAvatarColorHex(colorId: string | null | undefined): string | null {
  if (!colorId) return null;
  const c = AVATAR_COLOR_OPTIONS.find((o) => o.id === colorId);
  return c?.hex ?? null;
}
