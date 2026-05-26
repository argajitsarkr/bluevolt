import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Blue Volt Scientific - Small lab orders, Kolkata-sourced, NE-focused",
    template: "%s | Blue Volt Scientific",
  },
  description:
    "Lab chemicals, glassware, equipment + instrument servicing for scholars, MSc students, and small labs in Tripura and the North East. No minimum order, Kolkata sourcing, fast dispatch. Place a ₹1k-50k order, we call to confirm - no online payment.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem-8rem)]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
