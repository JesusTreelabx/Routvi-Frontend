import type { Metadata } from "next";
import { Geist, Geist_Mono, Oswald } from "next/font/google";
import { CartProvider } from "@/lib/cart-context";
import CartFloatingButton from "@/components/cart/CartButton";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Routvi - Descubre tu próximo antojo",
  description: "Plataforma de descubrimiento gastronómico con las mejores promociones cerca de ti.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${oswald.variable} antialiased min-h-screen bg-background font-sans text-foreground`}
      >
        <CartProvider>
          <main className="min-h-screen flex flex-col">
            {children}
          </main>
          <CartFloatingButton />
        </CartProvider>
      </body>
    </html>
  );
}
