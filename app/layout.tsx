import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Manrope } from "next/font/google"
import "./globals.css"

const geist = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
  style: ["normal"],
})

export const metadata: Metadata = {
  title: "Matlix - Premium Furniture & Design",
  description: "Discover premium furniture and interior design solutions crafted for sophisticated living spaces.",
  generator: "v0.app",
  keywords: "luxury furniture, premium interior design, modern furniture, sophisticated living, home decor",
  authors: [{ name: "Matlix" }],
  creator: "Matlix",
  publisher: "Matlix",
  openGraph: {
    title: "Matlix - Premium Furniture & Design",
    description: "Discover premium furniture and interior design solutions crafted for sophisticated living spaces.",
    url: "https://luxeinteriors.com",
    siteName: "Matlix",
    images: [
      {
        url: "/luxury-modern-living-room.png",
        width: 1200,
        height: 630,
        alt: "Matlix - Premium Furniture Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matlix - Premium Furniture & Design",
    description: "Discover premium furniture and interior design solutions crafted for sophisticated living spaces.",
    images: ["/luxury-modern-living-room.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} ${manrope.variable} antialiased`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-sans bg-background text-foreground">
        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  )
}
