export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
  const url = `${baseUrl}${path}`

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    let message = response.statusText
    try {
      const body = await response.json()
      if (typeof body?.message === 'string') message = body.message
      else if (Array.isArray(body?.message)) message = body.message[0]
    } catch {
      // resposta sem JSON — mantém statusText
    }
    throw new ApiError(response.status, message)
  }

  return response.json() as Promise<T>
}
