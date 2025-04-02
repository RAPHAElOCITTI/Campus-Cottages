import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://campuscottages.com'),
  title: {
    template: '%s | Campus Cottages',
    default: 'Campus Cottages - Find Perfect Student Accommodation Near Universities',
  },
  description: 'Campus Cottages helps students find affordable, convenient and comfortable hostels near universities. Search by location, price, and amenities to find your perfect student accommodation.',
  keywords: ['student housing', 'university accommodation', 'student hostels', 'campus hostels', 'student rentals', 'affordable student housing'],
  authors: [{ name: 'Campus Cottages Team' }],
  creator: 'Campus Cottages',
  publisher: 'Campus Cottages',
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://campuscottages.com',
    siteName: 'Campus Cottages',
    title: 'Campus Cottages - Student Accommodation Near Universities',
    description: 'Find perfect student accommodation and hostels near universities. Affordable, convenient, and verified rentals for students.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Campus Cottages - Student Accommodation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Campus Cottages - Student Accommodation',
    description: 'Find perfect student accommodation and hostels near universities.',
    images: ['/twitter-image.jpg'],
    creator: '@campuscottages',
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
  verification: {
    google: 'google-site-verification-code', // Replace with your actual verification code
  },
  alternates: {
    canonical: 'https://campuscottages.com',
    languages: {
      'en-US': 'https://campuscottages.com',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
