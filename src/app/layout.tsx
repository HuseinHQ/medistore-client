import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'react-hot-toast';
import { Suspense } from 'react';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: {
    template: '%s | MediStore',
    default: 'MediStore',
  },
  description: 'MediStore is a modern e-commerce platform for medical supplies.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextUIProvider>
          <Toaster />
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </NextUIProvider>
      </body>
    </html>
  );
}
