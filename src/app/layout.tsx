import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bebas = localFont({
  src: "./fonts/BebasNeue-Regular.ttf",
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  title: {
    default: "Romagna Summer Hoops Tour | Basket 3x3",
    template: "%s | Romagna Summer Hoops Tour",
  },
  description:
    "Il circuito estivo di basket 3x3 che unisce la Romagna. Tornei, classifiche, street culture e l'evento finale che incorona i campioni dell'estate.",
  keywords: [
    "basket 3x3",
    "romagna",
    "streetball",
    "torneo basket",
    "summer hoops",
    "basket estate",
    "3x3 basketball",
    "street basketball",
    "torneo 3x3 romagna",
  ],
  openGraph: {
    title: "Romagna Summer Hoops Tour",
    description:
      "Il primo circuito estivo di basket 3x3 in Romagna. Canestri, musica e street culture - da Maggio a Settembre 2026.",
    type: "website",
    locale: "it_IT",
    siteName: "Romagna Summer Hoops Tour",
  },
  twitter: {
    card: "summary_large_image",
    title: "Romagna Summer Hoops Tour",
    description:
      "Il primo circuito estivo di basket 3x3 in Romagna. Canestri, musica e street culture.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={`${inter.variable} ${bebas.variable} antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
