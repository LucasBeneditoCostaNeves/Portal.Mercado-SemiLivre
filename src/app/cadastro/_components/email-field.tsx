type EmailFieldProps = {
  error?: string
}

export function EmailField({ error }: EmailFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="email" className="text-sm font-medium text-gray-700">
        E-mail
      </label>
      <input
        id="email"
        name="email"
        type="email"
        placeholder="exemplo@email.com"
        autoComplete="email"
        aria-describedby={error ? 'email-error' : undefined}
        aria-invalid={!!error}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent aria-[invalid=true]:border-red-400 aria-[invalid=true]:ring-red-400 transition"
      />
      {error && (
        <p id="email-error" role="alert" className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  )
}
