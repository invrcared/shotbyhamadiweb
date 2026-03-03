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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
