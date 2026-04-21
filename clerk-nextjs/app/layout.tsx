import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import AppHeader from '@/components/layout/app-header';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'College Notes Management System',
  description: 'Frontend starter with Clerk, Axios, and a protected dashboard.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}>
        <ClerkProvider>
          <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(27,114,104,0.18),_transparent_30%),linear-gradient(180deg,_#f9fbfa_0%,_#eef4f1_100%)]">
            <AppHeader />
            {children}
          </div>
        </ClerkProvider>
      </body>
    </html>
  );
}
