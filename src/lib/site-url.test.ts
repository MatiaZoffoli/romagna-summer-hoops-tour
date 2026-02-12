import { describe, it, expect, afterEach } from "vitest";
import { getSiteUrl } from "./site-url";

describe("getSiteUrl", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns NEXT_PUBLIC_SITE_URL when set", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    delete process.env.VERCEL_URL;
    expect(getSiteUrl()).toBe("https://example.com");
  });

  it("returns https VERCEL_URL when NEXT_PUBLIC_SITE_URL is not set", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    process.env.VERCEL_URL = "my-app.vercel.app";
    expect(getSiteUrl()).toBe("https://my-app.vercel.app");
  });

  it("returns localhost in development when no site/vercel url", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_URL;
    process.env.NODE_ENV = "development";
    expect(getSiteUrl()).toBe("http://localhost:3000");
  });

  it("returns production fallback when not development and no env url", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    delete process.env.VERCEL_URL;
    process.env.NODE_ENV = "production";
    expect(getSiteUrl()).toBe("https://romagnasummerhoopstour.com");
  });
});
