import type { Metadata } from 'next'
import { MarketingPanel } from './_components/marketing-panel'
import { StepIndicator } from './_components/step-indicator'
import { RegisterForm } from './_components/register-form'

export const metadata: Metadata = {
  title: 'Criar conta | Mercado Livre',
  description: 'Crie sua conta no Mercado Livre e compre com frete grátis.',
}

export default function CadastroPage() {
  return (
    <div className="min-h-screen flex">
      {/* Painel esquerdo: marketing — oculto em telas pequenas */}
      <aside className="hidden lg:flex w-1/2 bg-[#FFE600]">
        <MarketingPanel />
      </aside>

      {/* Painel direito: formulário */}
      <main className="flex-1 bg-[#18181b] flex justify-center min-h-screen">
        <div className="w-full max-w-[480px] px-8 py-12">
          <StepIndicator currentStep={1} totalSteps={3} />

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Criar sua conta</h1>
            <p className="mt-1 text-zinc-400">É rápido, gratuito e sem complicação</p>
          </div>

          <RegisterForm />
        </div>
      </main>
    </div>
  )
}
