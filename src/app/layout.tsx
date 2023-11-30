import { ThemeProvider } from '@/components/ThemeProvider'
import { UserProvider } from '@/components/common'
import { Sidebar } from '@/components/layout/Sidebar'
import { Toaster } from '@/components/ui/toaster'
import { AppConfig } from '@/lib/config'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  ...AppConfig,
  icons: {
    icon: ['favicon/favicon.ico?v=4'],
    apple: ['favicon/apple-touch-icon.png?v=4'],
    shortcut: ['favicon/apple-touch-icon.png'],
  },
  manifest: 'favicon/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider>
            <div className="grid grid-rows-[50px_1fr] lg:grid-rows-1 grid-cols-5 xl:grid-cols-6 h-screen">
              <Sidebar className="col-span-5 lg:col-span-1" />
              <div className="col-span-5 lg:col-span-4 xl:col-span-5 lg:border-l border-gray-700 py-4 lg:py-6">
                {children}
              </div>
            </div>
          </UserProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
