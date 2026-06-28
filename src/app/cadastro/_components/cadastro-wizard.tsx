'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import { MarketingPanel } from './marketing-panel'
import { MobileMarketingBanner } from './mobile-marketing-banner'
import { StepIndicator } from './step-indicator'
import { RegisterForm } from './register-form'
import { PersonalDataForm } from './personal-data-form'
import { PreferencesForm } from './preferences-form'

export function CadastroWizard() {
  const [step, setStep] = useState(1)
  const router = useRouter()

  const handleStep1Success = useCallback(() => setStep(2), [])
  const handleStep2Back = useCallback(() => setStep(1), [])
  const handleStep2Success = useCallback(() => setStep(3), [])
  const handleStep3Success = useCallback(() => router.push('/'), [router])

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--color-brand)]">
      <div className="lg:hidden">
        <MobileMarketingBanner step={step} />
      </div>

      <aside className="hidden lg:flex w-1/2 bg-[var(--color-brand)]">
        <MarketingPanel step={step} />
      </aside>

      <main className="flex-1 bg-[var(--color-bg-primary)] rounded-t-3xl lg:rounded-none flex justify-center relative">
        <div className="absolute top-4 right-4">
          <ThemeToggle className="text-[var(--color-brand-dark)]" />
        </div>
        <div className="w-full max-w-[480px] px-6 lg:px-8 py-8 lg:py-12">
          <StepIndicator currentStep={step} totalSteps={3} />

          {step === 1 && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)] lg:hidden">
                  Vamos começar
                </h1>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)] lg:hidden">
                  Passo 1 de 3 — dados básicos
                </p>
                <h1 className="hidden lg:block text-3xl font-bold text-[var(--color-text-primary)]">
                  Criar sua conta
                </h1>
                <p className="hidden lg:block mt-1 text-[var(--color-text-secondary)]">
                  É rápido, gratuito e sem complicação
                </p>
              </div>
              <RegisterForm onSuccess={handleStep1Success} />
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)] lg:hidden">
                  Dados pessoais
                </h1>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)] lg:hidden">
                  Passo 2 de 3 — identidade e endereço
                </p>
                <h1 className="hidden lg:block text-3xl font-bold text-[var(--color-text-primary)]">
                  Dados pessoais
                </h1>
                <p className="hidden lg:block mt-1 text-[var(--color-text-secondary)]">
                  Precisamos confirmar sua identidade
                </p>
              </div>
              <PersonalDataForm
                onBack={handleStep2Back}
                onSuccess={handleStep2Success}
              />
            </>
          )}

          {step === 3 && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)] lg:hidden">
                  Suas preferências
                </h1>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)] lg:hidden">
                  Passo 3 de 3 — preferências
                </p>
                <h1 className="hidden lg:block text-3xl font-bold text-[var(--color-text-primary)]">
                  Personalize sua experiência
                </h1>
                <p className="hidden lg:block mt-1 text-[var(--color-text-secondary)]">
                  Escolha as categorias que mais combinam com você
                </p>
              </div>
              <PreferencesForm onSuccess={handleStep3Success} />
            </>
          )}
        </div>
      </main>
    </div>
  )
}
