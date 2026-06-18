import type { Metadata } from 'next'
import { LoginMarketingPanel } from './_components/login-marketing-panel'
import { LoginForm } from './_components/login-form'

export const metadata: Metadata = {
  title: 'Entrar | Mercado Livre',
  description: 'Entre na sua conta do Mercado Livre.',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FFE600]">
      <aside className="hidden lg:flex lg:w-1/2 bg-[#FFE600]">
        <LoginMarketingPanel />
      </aside>

      <main className="flex-1 bg-[#18181b] rounded-t-3xl lg:rounded-none flex items-center justify-center">
        <div className="w-full max-w-[480px] px-6 lg:px-8 py-10 lg:py-12">
          <LoginForm />
        </div>
      </main>
    </div>
  )
}
