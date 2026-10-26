import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://kalamandir.in"),
  title: {
    default: `${siteConfig.name} — Art & Dance Classes in Sector 52, Noida`,
    template: `%s · ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  keywords: [
    "dance classes", "art classes", "Noida", "Sector 52",
    "zumba", "wedding choreography", "Kala Mandir",
  ],
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Art & Dance Classes in Sector 52, Noida`,
    description: siteConfig.description,
    images: [{ url: "/assets/institute/km-place-08.jpg", width: 1582, height: 1600 }],
  },
  icons: {
    icon: [
      { type: "image/webp", url: "/assets/institute/km-artwork-08.webp" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2c1030",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-svh bg-paper text-text antialiased">
        <ScrollProgress />
        <Header />
        <main id="top">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
