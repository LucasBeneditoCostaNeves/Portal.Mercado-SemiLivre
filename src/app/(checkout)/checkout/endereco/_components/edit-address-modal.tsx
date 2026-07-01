'use client'

import { useEffect, useRef, useState } from 'react'
import { maskCep } from '@/lib/masks'
import { updateAddressAction } from '../actions'
import type { Address, CreateAddressPayload } from '@/types/address'

type Props = {
  address: Address | null
  onClose: () => void
  onSuccess: (address: Address) => void
}

type FormErrors = Partial<Record<keyof CreateAddressPayload, string>>

const REQUIRED_FIELDS: (keyof CreateAddressPayload)[] = ['cep', 'street', 'number', 'city', 'state']

const FIELD_LABELS: Record<keyof CreateAddressPayload, string> = {
  cep: 'CEP',
  street: 'Logradouro',
  number: 'Número',
  complement: 'Complemento',
  city: 'Cidade',
  state: 'Estado',
}

export function EditAddressModal({ address, onClose, onSuccess }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [pending, setPending] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  const [form, setForm] = useState<CreateAddressPayload>({
    cep: '',
    street: '',
    number: '',
    complement: '',
    city: '',
    state: '',
  })

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (address) {
      setForm({
        cep: address.cep,
        street: address.street,
        number: address.number,
        complement: address.complement ?? '',
        city: address.city,
        state: address.state,
      })
      setErrors({})
      setServerError(null)
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [address])

  function handleChange(field: keyof CreateAddressPayload, value: string) {
    const masked = field === 'cep' ? maskCep(value) : value
    setForm((prev) => ({ ...prev, [field]: masked }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const newErrors: FormErrors = {}
    for (const field of REQUIRED_FIELDS) {
      if (!form[field]?.trim()) {
        newErrors[field] = `${FIELD_LABELS[field]} é obrigatório`
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!address || !validate()) return

    setPending(true)
    setServerError(null)

    const result = await updateAddressAction(address.id, {
      ...form,
      complement: form.complement?.trim() || null,
    })

    setPending(false)

    if (!result.success) {
      setServerError(result.error)
      return
    }

    onSuccess({ ...address, ...form, complement: form.complement?.trim() || null })
  }

  function handleDialogClose() {
    if (!pending) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleDialogClose}
      className="m-auto w-full max-w-lg rounded-2xl p-0 shadow-xl backdrop:bg-black/50 open:flex open:flex-col"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
        <h2 className="text-base font-bold text-[var(--color-text-primary)]">Editar endereço</h2>
        <button
          type="button"
          onClick={onClose}
          disabled={pending}
          className="text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
          aria-label="Fechar"
        >
          <span className="text-xl leading-none" aria-hidden="true">×</span>
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex flex-col gap-4 px-6 py-5 overflow-y-auto"
      >
        {serverError && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{serverError}</p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field label="CEP" error={errors.cep} required>
            <input
              type="text"
              value={form.cep}
              onChange={(e) => handleChange('cep', e.target.value)}
              placeholder="00000-000"
              maxLength={9}
              className={inputCn(!!errors.cep)}
            />
          </Field>
          <Field label="Número" error={errors.number} required>
            <input
              type="text"
              value={form.number}
              onChange={(e) => handleChange('number', e.target.value)}
              placeholder="Ex: 123"
              className={inputCn(!!errors.number)}
            />
          </Field>
        </div>

        <Field label="Logradouro" error={errors.street} required>
          <input
            type="text"
            value={form.street}
            onChange={(e) => handleChange('street', e.target.value)}
            placeholder="Ex: Rua das Flores"
            className={inputCn(!!errors.street)}
          />
        </Field>

        <Field label="Complemento" error={errors.complement}>
          <input
            type="text"
            value={form.complement ?? ''}
            onChange={(e) => handleChange('complement', e.target.value)}
            placeholder="Apto, bloco, etc. (opcional)"
            className={inputCn(false)}
          />
        </Field>

        <div className="grid grid-cols-[1fr_auto] gap-3">
          <Field label="Cidade" error={errors.city} required>
            <input
              type="text"
              value={form.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Ex: São Paulo"
              className={inputCn(!!errors.city)}
            />
          </Field>
          <Field label="Estado" error={errors.state} required>
            <input
              type="text"
              value={form.state}
              onChange={(e) => handleChange('state', e.target.value.toUpperCase())}
              placeholder="SP"
              maxLength={2}
              className={inputCn(!!errors.state) + ' w-16 text-center'}
            />
          </Field>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="w-full py-3 rounded-xl bg-[#2D3277] text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-1"
        >
          {pending ? 'Salvando...' : 'Salvar alterações'}
        </button>
      </form>
    </dialog>
  )
}

function inputCn(hasError: boolean) {
  return [
    'w-full px-3 py-2 text-sm rounded-lg border bg-white text-[var(--color-text-primary)]',
    'placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-1',
    hasError
      ? 'border-red-400 focus:ring-red-400'
      : 'border-[var(--color-border)] focus:ring-[#2D3277]',
  ].join(' ')
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-[var(--color-text-secondary)]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
