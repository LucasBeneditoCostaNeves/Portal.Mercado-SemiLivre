import type { Address } from '@/types/address'

type Props = {
  address: Address
  selected: boolean
  onSelect: (id: string) => void
  onEdit: (address: Address) => void
}

export function AddressCard({ address, selected, onSelect, onEdit }: Props) {
  return (
    <div
      className={[
        'w-full text-left rounded-2xl border-2 px-5 py-4 transition-all',
        selected
          ? 'border-[#2D3277] bg-white shadow-sm'
          : 'border-[var(--color-border)] bg-white hover:border-zinc-300',
      ].join(' ')}
    >
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => onSelect(address.id)}
          aria-pressed={selected}
          className="flex items-center gap-4 flex-1 min-w-0 text-left"
        >
          <div
            className={[
              'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors',
              selected ? 'border-emerald-500 bg-emerald-500' : 'border-zinc-300 bg-white',
            ].join(' ')}
            aria-hidden="true"
          >
            {selected && <i className="ti ti-check text-white text-[10px]" />}
          </div>

          <div className="flex items-start gap-2 flex-1 min-w-0">
            <i
              className={[
                'ti ti-map-pin text-base mt-0.5 shrink-0',
                selected ? 'text-[#2D3277]' : 'text-[var(--color-text-tertiary)]',
              ].join(' ')}
              aria-hidden="true"
            />

            <div className="flex flex-col gap-0.5 text-sm min-w-0">
              <span className="font-semibold text-[var(--color-text-primary)] truncate">
                {address.street}, {address.number}
                {address.complement ? `, ${address.complement}` : ''}
              </span>
              <span className="text-[var(--color-text-secondary)] text-xs">
                {address.city} / {address.state}
              </span>
              <span className="text-[var(--color-text-tertiary)] text-xs">CEP {address.cep}</span>
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          {address.isDefault && (
            <span className="text-[10px] font-semibold text-amber-600 border border-amber-400 px-2 py-0.5 rounded-full">
              Endereço padrão
            </span>
          )}
          <button
            type="button"
            onClick={() => onEdit(address)}
            className="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-[#2D3277] hover:bg-zinc-100 transition-colors"
            aria-label="Editar endereço"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
