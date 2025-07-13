import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navigation from '../app/components/Navigation';
import './globals.css';
import Footer from './components/Footer';
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Joynous',
  description: 'A place to meet your kind of people',
  icons : {
    icon: '/favicon.png',
    apple: '/favicon-apple.png'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <Navigation />
        <main className="container mx-auto pt-4 md:pt-0">
          {children}
          <Analytics />
        </main>
        <Footer />
      </body>
    </html>
  );
}