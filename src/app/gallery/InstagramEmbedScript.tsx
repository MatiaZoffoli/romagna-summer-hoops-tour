"use client";

import Script from "next/script";

/**
 * Loads Instagram's embed.js so blockquotes with data-instgrm-permalink
 * get replaced with the official embed (with preview).
 */
export default function InstagramEmbedScript() {
  return (
    <Script
      src="https://www.instagram.com/embed.js"
      strategy="lazyOnload"
    />
  );
}
