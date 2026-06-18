'use client'

import { useCallback, useState } from 'react'
import { MarketingPanel } from './marketing-panel'
import { MobileMarketingBanner } from './mobile-marketing-banner'
import { StepIndicator } from './step-indicator'
import { RegisterForm } from './register-form'
import { PersonalDataForm } from './personal-data-form'

export function CadastroWizard() {
  const [step, setStep] = useState(1)

  const handleStep1Success = useCallback(() => setStep(2), [])
  const handleStep2Back    = useCallback(() => setStep(1), [])
  const handleStep2Success = useCallback(() => setStep(3), [])

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FFE600]">
      <div className="lg:hidden">
        <MobileMarketingBanner step={step} />
      </div>

      <aside className="hidden lg:flex w-1/2 bg-[#FFE600]">
        <MarketingPanel step={step} />
      </aside>

      <main className="flex-1 bg-[#18181b] rounded-t-3xl lg:rounded-none flex justify-center">
        <div className="w-full max-w-[480px] px-6 lg:px-8 py-8 lg:py-12">
          <StepIndicator currentStep={step} totalSteps={3} />

          {step === 1 && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white lg:hidden">Vamos começar</h1>
                <p className="mt-1 text-sm text-zinc-400 lg:hidden">Passo 1 de 3 — dados básicos</p>
                <h1 className="hidden lg:block text-3xl font-bold text-white">Criar sua conta</h1>
                <p className="hidden lg:block mt-1 text-zinc-400">É rápido, gratuito e sem complicação</p>
              </div>
              <RegisterForm onSuccess={handleStep1Success} />
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white lg:hidden">Dados pessoais</h1>
                <p className="mt-1 text-sm text-zinc-400 lg:hidden">Passo 2 de 3 — identidade e endereço</p>
                <h1 className="hidden lg:block text-3xl font-bold text-white">Dados pessoais</h1>
                <p className="hidden lg:block mt-1 text-zinc-400">Precisamos confirmar sua identidade</p>
              </div>
              <PersonalDataForm onBack={handleStep2Back} onSuccess={handleStep2Success} />
            </>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[#FFE600] flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1a1f6e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white">Quase lá!</h2>
              <p className="text-zinc-400 text-sm max-w-xs">
                Passo 3 — verificação de e-mail em breve.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
