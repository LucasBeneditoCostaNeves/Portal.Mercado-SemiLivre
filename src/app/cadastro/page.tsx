import type { Metadata } from 'next'
import { CadastroWizard } from './_components/cadastro-wizard'

export const metadata: Metadata = {
  title: 'Criar conta | Mercado Livre',
  description: 'Crie sua conta no Mercado Livre e compre com frete grátis.',
}

export default function CadastroPage() {
  return <CadastroWizard />
}
