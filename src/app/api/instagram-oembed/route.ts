import { NextRequest, NextResponse } from "next/server";

const OEMBED_BASE = "https://api.instagram.com/oembed";

// Allow Instagram post/reel URLs with optional query params (e.g. ?igsh=...)
function isValidInstagramPostUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (!/^(www\.)?instagram\.com$/i.test(u.hostname)) return false;
    const match = u.pathname.match(/^\/(p|reel)\/([A-Za-z0-9_-]+)\/?$/);
    return !!match;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url || !isValidInstagramPostUrl(url)) {
    return NextResponse.json({ error: "Invalid Instagram URL" }, { status: 400 });
  }

  try {
    const oembedUrl = `${OEMBED_BASE}?url=${encodeURIComponent(url)}`;
    const res = await fetch(oembedUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });

    const text = await res.text();
    if (!res.ok) {
      return NextResponse.json(
        { error: "Instagram oEmbed failed", details: text.slice(0, 500) },
        { status: res.status }
      );
    }

    let data: { html?: string; error?: string };
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: "Invalid JSON from Instagram" }, { status: 502 });
    }

    if (data.error || !data.html) {
      return NextResponse.json(
        { error: data.error || "No embed HTML in response" },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("instagram-oembed:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch oEmbed" },
      { status: 500 }
    );
  }
}
