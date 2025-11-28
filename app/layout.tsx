import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Fraunces } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-serif", display: "swap" })

export const metadata: Metadata = {
  title: "PDFForge - Professional Image to PDF Converter | API & Web App",
  description: "Convert images to PDF instantly with our powerful web app and API. Support for multiple formats, batch processing, and developer-friendly integration. Free tier available.",
  keywords: ["PDF converter", "image to PDF", "PDF API", "batch PDF conversion", "developer tools"],
  authors: [{ name: "PDFForge" }],
  creator: "PDFForge",
  publisher: "PDFForge",
  openGraph: {
    title: "PDFForge - Professional Image to PDF Converter",
    description: "Convert images to PDF with our powerful API and web app. Free tier available.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDFForge - Professional Image to PDF Converter",
    description: "Convert images to PDF with our powerful API and web app.",
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} ${fraunces.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
