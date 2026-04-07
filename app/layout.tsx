import type { Metadata } from 'next'
import { DM_Sans, DM_Mono } from 'next/font/google'
import StarField from '@/components/StarField'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css' 

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
})

export const metadata: Metadata = {
  title: 'GitGet',
  description: 'Deep insights into any GitHub profile. Understand repos, commits, patterns and coding personality at a glance.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`} suppressHydrationWarning>
      <body className="font-sans bg-zinc-50 dark:bg-[#0a0a0a] text-slate-900 dark:text-[#efefef] min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          <StarField />
          <div className="transition-opacity duration-500">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
