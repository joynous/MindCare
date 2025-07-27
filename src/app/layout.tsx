// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ClientProviders from './components/ClientProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Joynous',
  description: 'A place to meet your kind of people',
  icons: {
    icon: '/favicon.png',
    apple: '/favicon-apple.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Navigation, session timeout, and other client logic live inside ClientProviders */}
        <ClientProviders>
          <Navigation />
          <main className="container mx-auto pt-4 md:pt-0">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
