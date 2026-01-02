// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import Script from 'next/script';
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
      <head>
        <Script id="fb-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1420950979681025');
fbq('track', 'PageView');`}
        </Script>
      </head>
      <body className={inter.className}>
        {/* Navigation, session timeout, and other client logic live inside ClientProviders */}
        <ClientProviders>
          <header id="2041258166696134" role="banner">
            <Navigation />
          </header>
          <main className="container mx-auto pt-4 md:pt-0">{children}</main>
          <Footer />
          <noscript dangerouslySetInnerHTML={{ __html: '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1420950979681025&ev=PageView&noscript=1" />' }} />
        </ClientProviders>
      </body>
    </html>
  );
}
