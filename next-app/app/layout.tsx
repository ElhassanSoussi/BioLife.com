import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BioLife.com — Free Brush & More',
  description: 'Free Brush & More — modern, clean beauty essentials.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

