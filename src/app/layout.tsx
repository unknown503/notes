import { ThemeProvider } from '@/components/ThemeProvider'
import { NewSidebar } from '@/components/layout/NewSidebar'
import ToTop from '@/components/ui/ToTop'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Toaster } from '@/components/ui/toaster'
import { UserProvider } from '@/context/UserContext'
import { AppConfig } from '@/lib/config'
import type { Metadata, Viewport } from 'next'
import dynamic from 'next/dynamic'
import { Inter } from 'next/font/google'
import './globals.css'
import IconsProvider from '@/context/IconsContext'

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
            <SidebarProvider>
              <IconsProvider>
                <NewSidebar />
                <main className='w-full pb-4 lg:pb-6'>
                  <div className="container pt-3 block md:hidden">
                    <SidebarTrigger size="icon" className='bg-accent p-1' />
                  </div>
                  {children}
                </main>
              </IconsProvider>
            </SidebarProvider>
          </UserProvider>
          <ToTop />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
