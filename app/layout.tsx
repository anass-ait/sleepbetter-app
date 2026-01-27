import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SleepBetter - Track Your Sleep Quality",
  description:
    "SleepBetter helps students track sleep patterns, receive personalized insights, and improve sleep quality with data-driven advice.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans antialiased w-full min-h-screen overflow-x-hidden`}
        style={{
          transform: "scale(1.15)",        // ZOOM A 115%
          transformOrigin: "top center",   // ZOOM CENTRÉ
          width: "100%",                   // GARANTIR PLEIN ÉCRAN
        }}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="w-full mx-0 px-0">{children}</div>
        </ThemeProvider>

        <Analytics />
      </body>
    </html>
  )
}
