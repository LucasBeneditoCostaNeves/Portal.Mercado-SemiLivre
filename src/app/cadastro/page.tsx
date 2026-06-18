import type { Metadata } from 'next'
import { MarketingPanel } from './_components/marketing-panel'
import { MobileMarketingBanner } from './_components/mobile-marketing-banner'
import { StepIndicator } from './_components/step-indicator'
import { RegisterForm } from './_components/register-form'

export const metadata: Metadata = {
  title: 'Criar conta | Mercado Livre',
  description: 'Crie sua conta no Mercado Livre e compre com frete grátis.',
}

export default function CadastroPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="lg:hidden">
        <MobileMarketingBanner />
      </div>

      <aside className="hidden lg:flex w-1/2 bg-[#FFE600]">
        <MarketingPanel />
      </aside>

      <main className="flex-1 bg-[#18181b] rounded-t-3xl lg:rounded-none flex justify-center">
        <div className="w-full max-w-[480px] px-6 lg:px-8 py-8 lg:py-12">
          <StepIndicator currentStep={1} totalSteps={3} />

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white lg:hidden">Vamos começar</h1>
            <p className="mt-1 text-sm text-zinc-400 lg:hidden">Passo 1 de 3 — dados básicos</p>
            <h1 className="hidden lg:block text-3xl font-bold text-white">Criar sua conta</h1>
            <p className="hidden lg:block mt-1 text-zinc-400">É rápido, gratuito e sem complicação</p>
          </div>

          <RegisterForm />
        </div>
      </main>
    </div>
  )
}
