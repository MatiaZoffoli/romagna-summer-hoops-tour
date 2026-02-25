import { NextRequest, NextResponse } from "next/server";

const OEMBED_BASE = "https://api.instagram.com/oembed";
const INSTAGRAM_URL_REGEX = /^https?:\/\/(www\.)?instagram\.com\/(p|reel)\/[A-Za-z0-9_-]+\/?/;

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url || !INSTAGRAM_URL_REGEX.test(url)) {
    return NextResponse.json({ error: "Invalid Instagram URL" }, { status: 400 });
  }

  try {
    const oembedUrl = `${OEMBED_BASE}?url=${encodeURIComponent(url)}`;
    const res = await fetch(oembedUrl, {
      headers: { "User-Agent": "RomagnaSummerHoopsTour/1.0" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: "Instagram oEmbed failed", details: text },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("instagram-oembed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch oEmbed" },
      { status: 500 }
    );
  }
}
