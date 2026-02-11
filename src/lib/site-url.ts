/**
 * Get the site URL for the application
 * Uses NEXT_PUBLIC_SITE_URL if set, otherwise falls back to Vercel URL or default
 */
export function getSiteUrl(): string {
  // In production, use the environment variable
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // In Vercel preview/deployment, use VERCEL_URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback for local development
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // Production fallback (should be replaced with your domain)
  return "https://romagnasummerhoopstour.com";
}
