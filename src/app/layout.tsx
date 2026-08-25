import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

export const runtime = "edge";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShotByHamadi",
  description: "High-end, professional photography and videography platform for ShotByHamadi Media.",
  metadataBase: new URL("https://www.shotbyhamadi.com"),
  alternates: {
    canonical: "./",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import Header from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased text-white bg-[#050510]`}>
        {/* Starfield Background */}
        <div id="starfield" aria-hidden="true">
          <div className="stars-layer stars-sm" />
          <div className="stars-layer stars-md" />
          <div className="stars-layer stars-lg" />
        </div>
        <div className="relative z-10">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
