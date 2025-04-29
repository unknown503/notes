import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from '@/components/ui/toaster'
import { AppConfig } from '@/lib/config'
import type { Metadata, Viewport } from 'next'
import dynamic from 'next/dynamic'
import { Inter } from 'next/font/google'
import './globals.css'
import { UserProvider } from '@/context/UserContext'

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

export const viewport: Viewport = {
  themeColor: "#020817",
}

const Sidebar = dynamic(() => import('../components/layout/Sidebar'))

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
            <div className="grid grid-rows-[50px_1fr] lg:grid-rows-1 grid-cols-5 xl:grid-cols-6">
              <Sidebar className="col-span-5 lg:col-span-1 h-[100dvh] block lg:sticky top-0 lg:border-r border-gray-700 z-30" />
              <div className="col-span-5 lg:col-span-4 xl:col-span-5 pb-4 lg:pb-6">
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
