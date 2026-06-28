'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { savePersonalData } from '../actions'
import type { PersonalDataFormState } from '@/domain/auth/types'
import { FormField } from '@/components/ui/form-field'
import { SelectField } from '@/components/ui/select-field'
import { BR_STATES } from '@/constants/brazil'
import { maskCep, maskCpf, maskDate, maskPhone } from '@/lib/masks'

const INITIAL_STATE: PersonalDataFormState = {}

const inputCls = "w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500 transition"

type Props = {
  onBack: () => void
  onSuccess: () => void
}

function FormActions({ onBack }: { onBack: () => void }) {
  const { pending } = useFormStatus()
  return (
    <div className="flex gap-3 mt-2">
      <button
        type="button"
        onClick={onBack}
        disabled={pending}
        className="flex-1 py-3 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-secondary)] text-sm rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ← Voltar
      </button>
      <button
        type="submit"
        disabled={pending}
        className="flex-[2] py-3.5 bg-[var(--color-brand)] hover:bg-yellow-400 text-[var(--color-brand-dark)] text-sm font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? 'Salvando...' : 'Continuar →'}
      </button>
    </div>
  )
}

export function PersonalDataForm({ onBack, onSuccess }: Props) {
  const [state, formAction] = useActionState(savePersonalData, INITIAL_STATE)

  const [cpf, setCpf]           = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [phone, setPhone]       = useState('')
  const [cep, setCep]           = useState('')

  useEffect(() => {
    if (state.success) onSuccess()
  }, [state.success, onSuccess])

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cpf" className="text-sm text-[var(--color-text-secondary)]">CPF</label>
          <input
            id="cpf"
            name="cpf"
            type="text"
            inputMode="numeric"
            placeholder="000.000.000-00"
            autoComplete="off"
            value={cpf}
            onChange={(e) => setCpf(maskCpf(e.target.value))}
            aria-describedby={state.errors?.cpf ? 'cpf-error' : undefined}
            aria-invalid={!!state.errors?.cpf}
            className={inputCls}
          />
          {state.errors?.cpf && (
            <p id="cpf-error" role="alert" className="text-xs text-red-400">{state.errors.cpf[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="birthDate" className="text-sm text-[var(--color-text-secondary)]">Data de nascimento</label>
          <input
            id="birthDate"
            name="birthDate"
            type="text"
            inputMode="numeric"
            placeholder="DD/MM/AAAA"
            autoComplete="bday"
            value={birthDate}
            onChange={(e) => setBirthDate(maskDate(e.target.value))}
            aria-describedby={state.errors?.birthDate ? 'birthDate-error' : undefined}
            aria-invalid={!!state.errors?.birthDate}
            className={inputCls}
          />
          {state.errors?.birthDate && (
            <p id="birthDate-error" role="alert" className="text-xs text-red-400">{state.errors.birthDate[0]}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className="text-sm text-[var(--color-text-secondary)]">Telefone celular</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          placeholder="(11) 99999-9999"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(maskPhone(e.target.value))}
          aria-describedby={state.errors?.phone ? 'phone-error' : undefined}
          aria-invalid={!!state.errors?.phone}
          className={inputCls}
        />
        {state.errors?.phone && (
          <p id="phone-error" role="alert" className="text-xs text-red-400">{state.errors.phone[0]}</p>
        )}
      </div>

      <SelectField id="gender" name="gender" label="Gênero" error={state.errors?.gender?.[0]}>
        <option value="" disabled>Selecione</option>
        <option value="masculino">Masculino</option>
        <option value="feminino">Feminino</option>
        <option value="nao-binario">Não-binário</option>
        <option value="prefiro-nao-informar">Prefiro não informar</option>
      </SelectField>

      <div className="border-t border-[var(--color-border)] pt-4 mt-1 flex flex-col gap-4">
        <p className="text-sm font-medium text-[var(--color-text-primary)] -mb-1">Endereço de entrega</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cep" className="text-sm text-[var(--color-text-secondary)]">CEP</label>
            <input
              id="cep"
              name="cep"
              type="text"
              inputMode="numeric"
              placeholder="00000-000"
              autoComplete="postal-code"
              value={cep}
              onChange={(e) => setCep(maskCep(e.target.value))}
              aria-describedby={state.errors?.cep ? 'cep-error' : undefined}
              aria-invalid={!!state.errors?.cep}
              className={inputCls}
            />
            {state.errors?.cep && (
              <p id="cep-error" role="alert" className="text-xs text-red-400">{state.errors.cep[0]}</p>
            )}
          </div>

          <SelectField id="state" name="state" label="Estado" error={state.errors?.state?.[0]}>
            <option value="" disabled>UF</option>
            {BR_STATES.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </SelectField>
        </div>

        <FormField
          id="city"
          name="city"
          label="Cidade"
          placeholder="São Paulo"
          autoComplete="address-level2"
          error={state.errors?.city?.[0]}
        />

        <div className="grid grid-cols-[2fr_1fr_1fr] gap-3">
          <FormField
            id="street"
            name="street"
            label="Logradouro"
            placeholder="Rua das Flores"
            autoComplete="street-address"
            error={state.errors?.street?.[0]}
          />
          <FormField
            id="number"
            name="number"
            label="Número"
            placeholder="123"
            error={state.errors?.number?.[0]}
          />
          <FormField
            id="complement"
            name="complement"
            label="Complemento"
            placeholder="Apto 4"
            autoComplete="address-line2"
          />
        </div>
      </div>

      <FormActions onBack={onBack} />
    </form>
  )
}
