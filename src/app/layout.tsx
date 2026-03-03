import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

export const runtime = "edge";

const inter = Inter({
  variable: "--font-inter",
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
      <body className={`${inter.variable} font-sans antialiased text-white bg-black`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
