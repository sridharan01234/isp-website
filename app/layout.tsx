import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import  Navbar  from '@/components/ui/navbar';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import {Footer} from '@/components/ui/footer'
import { ThemeProvider } from '@/components/theme-provider';
import { PageTransition } from '@/components/transition';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ThillaiCable - High Speed Internet Provider",
  description: "Experience lightning-fast fiber internet with unlimited possibilities. Choose from our range of plans and get connected today.",
  keywords: "ISP, internet service provider, fiber internet, high speed internet, broadband",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-gray-900 transition-colors duration-200`}
      >
        <ThemeProvider>
          <Navbar />
          <FloatingActionButton />
          <PageTransition>
            {children}
          </PageTransition>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
