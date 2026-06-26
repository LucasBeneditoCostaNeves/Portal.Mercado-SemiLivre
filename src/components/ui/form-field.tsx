type FormFieldProps = {
  id: string
  name: string
  label: string
  type?: 'text' | 'email' | 'password'
  placeholder?: string
  autoComplete?: string
  error?: string
}

export function FormField({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  autoComplete,
  error,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-[var(--color-text-secondary)]">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        className="w-full px-4 py-3 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent aria-[invalid=true]:border-red-500 aria-[invalid=true]:ring-red-500 transition"
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
