import Link from 'next/link'
import Navbar from '../(home)/_components/navbar'

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      <Navbar />
      {children}
    </div>
  )
}
