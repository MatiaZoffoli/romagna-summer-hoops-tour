import { NextRequest, NextResponse } from "next/server";

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

const OG_IMAGE_REGEXES = [
  /<meta\s+property="og:image"\s+content="([^"]+)"/i,
  /<meta\s+content="([^"]+)"\s+property="og:image"/i,
  /<meta\s+property='og:image'\s+content='([^']+)'/i,
  /content="(https:\/\/[^"]*cdninstagram[^"]+)"/i,
];

function extractOgImage(html: string): string | null {
  for (const re of OG_IMAGE_REGEXES) {
    const match = html.match(re);
    if (match?.[1]) {
      let url = match[1].trim().replace(/&amp;/g, "&");
      if (url.startsWith("http")) return url;
    }
  }
  return null;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url || !isValidInstagramPostUrl(url)) {
    return NextResponse.json({ error: "Invalid Instagram URL" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch post page" },
        { status: 502 }
      );
    }

    const html = await res.text();
    const imageUrl = extractOgImage(html);

    if (!imageUrl) {
      return NextResponse.json(
        { error: "No og:image in response" },
        { status: 502 }
      );
    }

    return NextResponse.json({ imageUrl });
  } catch (err) {
    console.error("instagram-image:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch image" },
      { status: 500 }
    );
  }
}
