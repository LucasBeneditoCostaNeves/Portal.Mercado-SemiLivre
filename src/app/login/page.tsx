import type { Metadata } from 'next'
import { ThemeToggle } from '@/components/theme-toggle'
import { LoginMarketingPanel } from './_components/login-marketing-panel'
import { LoginForm } from './_components/login-form'
import { LoginMobileBanner } from './_components/login-mobile-banner'

export const metadata: Metadata = {
  title: 'Entrar | Mercado Livre',
  description: 'Entre na sua conta do Mercado Livre.',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--color-brand)]">
      <aside className="hidden lg:flex lg:w-1/2 bg-[var(--color-brand)]">
        <LoginMarketingPanel />
      </aside>

      <LoginMobileBanner />

      <main className="flex-1 bg-[var(--color-bg-primary)] rounded-t-3xl lg:rounded-none flex items-center justify-center relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle className="text-[var(--color-brand-dark)]" />
        </div>
        <div className="w-full max-w-[480px] px-6 lg:px-8 py-10 lg:py-12">
          <LoginForm />
        </div>
      </main>
    </div>
  )
}
