type SelectFieldProps = {
  id: string
  name: string
  label: string
  error?: string
  children: React.ReactNode
}

export function SelectField({ id, name, label, error, children }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-zinc-400">
        {label}
      </label>
      <select
        id={id}
        name={name}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#FFE600] focus:border-transparent aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500 transition appearance-none"
      >
        {children}
      </select>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
