import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { decodeJwt } from '@/lib/jwt'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = await getSession()

  if (!token) {
    redirect('/login')
  }

  const payload = decodeJwt(token)

  if (payload?.role !== 'admin') {
    redirect('/')
  }

  return <>{children}</>
}
