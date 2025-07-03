import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "psychotherapist.ai - Find Your Perfect Therapist Match",
  description: "AI-powered therapist matching platform that connects you with mental health professionals based on your unique needs and preferences.",
  keywords: ["therapy", "mental health", "therapist matching", "AI", "counseling", "psychotherapy"],
  authors: [{ name: "psychotherapist.ai" }],
  openGraph: {
    title: "psychotherapist.ai - Find Your Perfect Therapist Match",
    description: "AI-powered therapist matching platform that connects you with mental health professionals based on your unique needs and preferences.",
    url: "https://psychotherapist.ai",
    siteName: "psychotherapist.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "psychotherapist.ai - Find Your Perfect Therapist Match",
    description: "AI-powered therapist matching platform that connects you with mental health professionals based on your unique needs and preferences.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
} 