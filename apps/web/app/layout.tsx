import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PulseCommerce OS | Tier-1 Retail & AI POS",
  description: "Next-generation Retail & POS Operating System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`dark ${dmSans.variable}`}>
      <body className="antialiased min-h-screen bg-background text-foreground selection:bg-white/20 selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
