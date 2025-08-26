import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { RegistrationProvider } from "@/contexts/RegistrationContext";
import { ReceiptProvider } from "@/contexts/ReceiptContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | MNU Marathon',
    default: 'MNU Marathon - Race Event Registration'
  },
  description: "Register for the upcoming MNU Marathon race event. Join thousands of runners in our premier racing events.",
  keywords: ['mnu-marathon', 'marathon', 'race', 'running', 'MNU', 'registration', 'event'],
  authors: [{ name: 'MNU Marathon Devs' }],
  creator: 'MNU Marathon Devs',
  publisher: 'MNU Marathon Devs',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/marathon-banner.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RegistrationProvider>
          <ReceiptProvider>
            {children}
            <Toaster />
          </ReceiptProvider>
        </RegistrationProvider>
      </body>
    </html>
  );
}
