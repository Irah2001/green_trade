import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Green Trade - Marketplace Locale de Produits Frais",
  description: "Achetez et vendez des produits frais locaux directement aux producteurs. Fruits, légumes, paniers bio de proximité.",
  keywords: ["Green Trade", "marché local", "produits frais", "bio", "fruits", "légumes", "producteurs", "local"],
  authors: [{ name: "Green Trade" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Green Trade - Marketplace Locale",
    description: "Vendez vos surplus, achetez local !",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} antialiased bg-[#F8F9FA] text-foreground min-h-screen flex flex-col`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
