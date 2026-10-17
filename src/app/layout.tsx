import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"
import Providers from "@/components/Providers";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ReelFlow | Short Video Upload & Streaming Platform",
    template: "%s | ReelFlow",
  },
  description:
    "A modern full-stack short video sharing platform built with Next.js, ImageKit, NextAuth, and Tailwind CSS. Upload, manage, and stream seamless reel-style videos.",
  keywords: [
    "Next.js",
    "Short Videos",
    "Reels",
    "ImageKit Video Streaming",
    "NextAuth",
    "Tailwind CSS",
    "Video Uploader",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Header />
        {children}
        </Providers>
      </body>
    </html>
  );
}
