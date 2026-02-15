"use client";

import type { FC } from "react";

/** Basketball/NBA-style silhouettes for MVP placeholder cards. Each is a simple SVG. */
const SilhouetteDunk: FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 96" className={className} fill="currentColor" aria-hidden>
    <path d="M32 8c-4 0-8 3-8 8v12l-8 4v8l8-2 4 24 4-26 8 2v-8l-8-4V16c0-5-4-8-8-8z" opacity="0.4" />
    <ellipse cx="32" cy="88" rx="12" ry="6" opacity="0.5" />
  </svg>
);

const SilhouetteShoot: FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 96" className={className} fill="currentColor" aria-hidden>
    <path d="M32 4c-6 0-10 5-10 10v14l-6 20 6 4 6-18 8 32 8-32 6 18 6-4 6-20-10-14c0-5-4-10-10-10z" opacity="0.4" />
    <circle cx="48" cy="32" r="8" opacity="0.5" />
    <ellipse cx="32" cy="88" rx="10" ry="5" opacity="0.5" />
  </svg>
);

const SilhouetteDribble: FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 96" className={className} fill="currentColor" aria-hidden>
    <path d="M28 6l4 16h-8l-6 12 6 8 4-6 6 20 4-4-6-22 8-6-4-16z" opacity="0.4" />
    <circle cx="36" cy="72" r="10" opacity="0.5" />
    <circle cx="20" cy="48" r="6" opacity="0.45" />
  </svg>
);

const SilhouetteHoop: FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 96" className={className} fill="currentColor" aria-hidden>
    <path d="M12 24h40v4H12z" opacity="0.5" />
    <path d="M8 28v8c0 4 4 8 8 8h32c4 0 8-4 8-8v-8" opacity="0.4" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M32 36v44M24 80h16" opacity="0.35" stroke="currentColor" strokeWidth="2" />
    <circle cx="32" cy="52" r="14" opacity="0.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const SilhouetteBall: FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 96" className={className} fill="currentColor" aria-hidden>
    <circle cx="32" cy="48" r="22" opacity="0.4" />
    <path d="M32 26c-12 0-22 10-22 22s10 22 22 22" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.5" />
    <path d="M32 26c12 0 22 10 22 22s-10 22-22 22" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.35" />
  </svg>
);

const SilhouetteLayup: FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 96" className={className} fill="currentColor" aria-hidden>
    <path d="M36 8l-4 14 6 6-6 18 4 4 8-24-6-6 4-14z" opacity="0.4" />
    <path d="M28 50l4 8 4-8 4 28-4 4-4-20-4 20-4-4 4-28z" opacity="0.45" />
    <ellipse cx="32" cy="88" rx="10" ry="5" opacity="0.5" />
  </svg>
);

const SilhouetteDefense: FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 96" className={className} fill="currentColor" aria-hidden>
    <path d="M32 4l-8 12v10l-8 8 4 8 12-6 12 6 4-8-8-8v-10L32 4z" opacity="0.4" />
    <path d="M24 42l8 12 8-12 4 24-8 8-4-12-4 12-8-8 4-24z" opacity="0.45" />
    <ellipse cx="32" cy="88" rx="12" ry="6" opacity="0.5" />
  </svg>
);

const SilhouetteRebound: FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 64 96" className={className} fill="currentColor" aria-hidden>
    <path d="M32 6l-6 20h12L32 6z" opacity="0.4" />
    <path d="M20 26v8l12 8 12-8v-8" opacity="0.45" />
    <circle cx="32" cy="52" r="6" opacity="0.5" />
    <path d="M26 58l6 24 6-24 6 24 6-24" opacity="0.4" />
    <ellipse cx="32" cy="88" rx="10" ry="5" opacity="0.5" />
  </svg>
);

export const MVP_PLACEHOLDER_SILHOUETTES = [
  SilhouetteDunk,
  SilhouetteShoot,
  SilhouetteDribble,
  SilhouetteHoop,
  SilhouetteBall,
  SilhouetteLayup,
  SilhouetteDefense,
  SilhouetteRebound,
] as const;

export type MvpPlaceholderSilhouette = (typeof MVP_PLACEHOLDER_SILHOUETTES)[number];
