import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MNU Marathon Receipt',
  robots: 'noindex, nofollow',
};

export default function ReceiptPrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
