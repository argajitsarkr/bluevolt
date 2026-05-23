import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = Roboto_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Blue Volt Scientific - Chemicals, glassware, equipment, servicing", template: "%s | Blue Volt Scientific" },
  description: "Discounted scientific catalog and repair/servicing - place an order, we call back to confirm.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-3.5rem-6rem)]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
