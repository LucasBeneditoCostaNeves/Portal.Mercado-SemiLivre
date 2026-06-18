'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { savePersonalData } from '../actions'
import type { PersonalDataFormState } from '@/domain/auth/types'
import { FormField } from './form-field'
import { SelectField } from './select-field'

const INITIAL_STATE: PersonalDataFormState = {}

const BR_STATES = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA',
  'MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN',
  'RS','RO','RR','SC','SP','SE','TO',
]

type Props = {
  onBack: () => void
  onSuccess: () => void
}

function maskCpf(v: string) {
  return v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, '$1.$2.$3-$4')
}

function maskDate(v: string) {
  return v.replace(/\D/g, '').slice(0, 8)
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})\/(\d{2})(\d)/, '$1/$2/$3')
}

function maskPhone(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 10) return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2')
  return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2')
}

function maskCep(v: string) {
  return v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2')
}

function FormActions({ onBack }: { onBack: () => void }) {
  const { pending } = useFormStatus()
  return (
    <div className="flex gap-3 mt-2">
      <button
        type="button"
        onClick={onBack}
        disabled={pending}
        className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 text-sm rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ← Voltar
      </button>
      <button
        type="submit"
        disabled={pending}
        className="flex-[2] py-3.5 bg-[#FFE600] hover:bg-yellow-400 text-[#1a1f6e] text-sm font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
  }, [state.success]) // onSuccess é estável (useCallback no wizard)

  return (
    <form action={formAction} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="cpf" className="text-sm text-zinc-400">CPF</label>
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
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FFE600] focus:border-transparent aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500 transition"
          />
          {state.errors?.cpf && (
            <p id="cpf-error" role="alert" className="text-xs text-red-400">{state.errors.cpf[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="birthDate" className="text-sm text-zinc-400">Data de nascimento</label>
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
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FFE600] focus:border-transparent aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500 transition"
          />
          {state.errors?.birthDate && (
            <p id="birthDate-error" role="alert" className="text-xs text-red-400">{state.errors.birthDate[0]}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="phone" className="text-sm text-zinc-400">Telefone celular</label>
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
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FFE600] focus:border-transparent aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500 transition"
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

      <div className="border-t border-zinc-700 pt-4 mt-1 flex flex-col gap-4">
        <p className="text-sm font-medium text-white -mb-1">Endereço de entrega</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cep" className="text-sm text-zinc-400">CEP</label>
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
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#FFE600] focus:border-transparent aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500 transition"
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
