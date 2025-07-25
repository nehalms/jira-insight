import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Providers } from './providers'
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Jira Insights - Task Visualization Dashboard",
  description: "Visualize and analyze your Jira tasks with powerful charts and insights",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ThemeProvider defaultTheme="system">
            {children}
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}

