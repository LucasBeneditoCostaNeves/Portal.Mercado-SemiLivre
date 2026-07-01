import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { SessionProvider } from '@/contexts/session-context'
import { ToastProvider } from '@/components/toast-provider'
import { getSession } from '@/lib/session'
import './globals.css'

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'Mercado Livre',
  description: 'Compre, venda e economize de verdade.',
}

const themeScript = `(function(){try{var t=localStorage.getItem('theme');document.documentElement.classList.add(t==='light'?'light':'dark')}catch(e){document.documentElement.classList.add('dark')}})()`

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const token = (await getSession()) ?? null

  return (
    <html
      lang="pt-BR"
      className={`${roboto.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <SessionProvider token={token}>{children}</SessionProvider>
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  )
}
