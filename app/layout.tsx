import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "@/contexts/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Race Event Registration",
  description: "Register for the upcoming race event",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {children}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
