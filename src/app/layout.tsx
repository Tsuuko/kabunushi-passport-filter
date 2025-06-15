import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { StructuredData } from '@/components/StructuredData';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://kabu-passport.tsuuko.dev'),
  title: '株主パスポート企業検索',
  description:
    '証券コードまたは企業名から株主パスポート参加企業を検索できるWebアプリ',
  keywords: ['株主パスポート', '企業検索', '証券コード', '株主優待', '投資'],
  authors: [{ name: 'tsuuko' }],
  creator: 'tsuuko',
  publisher: 'tsuuko',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://kabu-passport.tsuuko.dev/',
    siteName: '株主パスポート企業検索',
    title: '株主パスポート企業検索',
    description:
      '証券コードまたは企業名から株主パスポート参加企業を検索できるWebアプリ',
    images: [
      {
        url: '/images/ogp.png',
        width: 1200,
        height: 630,
        alt: '株主パスポート企業検索 - 証券コードまたは企業名から参加企業を検索',
      },
    ],
  },
  twitter: {
    card: 'summary',
    site: '@_Tsuuko_',
    creator: '@_Tsuuko_',
    title: '株主パスポート企業検索',
    description:
      '証券コードまたは企業名から株主パスポート参加企業を検索できるWebアプリ',
    images: ['/images/twitter-summary.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
