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

const OG_IMAGE_REGEX = /<meta\s+property="og:image"\s+content="([^"]+)"/i;

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url || !isValidInstagramPostUrl(url)) {
    return NextResponse.json({ error: "Invalid Instagram URL" }, { status: 400 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html",
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
    const match = html.match(OG_IMAGE_REGEX);
    const imageUrl = match ? match[1].trim() : null;

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
