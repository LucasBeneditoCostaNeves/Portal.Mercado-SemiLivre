import Image from 'next/image'
import Link from 'next/link'
import { Department } from '@/domain/catalog/types'

const departmentImages: Record<string, string> = {
  Beauty: '/maquiagem.png',
  Fragrances: '/perfume.png',
  Furniture: '/cadeira.png',
  Groceries: '/fruteira.png',
  Laptops: '/laptop.png',
  Smartphones: '/smartphone.png',
  'Sports-accessories': '/treino.png',
}

export default function DepartmentsGrid({
  departments,
}: {
  departments: Department[]
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
      {departments.map((dept) => {
        const image = departmentImages[dept.label]
        return (
          <Link
            key={dept.id}
            href={`/c/${dept.id}`}
            className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-xl px-2 py-3.5 flex flex-col items-center gap-2 hover:border-[var(--color-bg-elevated)] transition-colors"
          >
            <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-[var(--color-brand)]">
              {image ? (
                <Image
                  src={image}
                  alt={dept.label}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <i
                  className={`ti ${dept.icon} text-xl text-[var(--color-brand-dark)]`}
                  aria-hidden="true"
                />
              )}
            </div>
            <span className="text-xs text-[var(--color-text-secondary)] text-center leading-tight">
              {dept.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
