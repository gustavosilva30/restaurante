import { prisma } from "@/lib/prisma"
import { AppLayout } from "@/components/layout/app-layout"
import { FinanceiroClient } from "@/components/financeiro/financeiro-client"

export const dynamic = "force-dynamic"

export default async function FinanceiroPage() {
  // Carregamos a empresa demo populada pelo seeder
  const company = await prisma.company.findUnique({
    where: { domain: "saborearte" },
  })

  if (!company) {
    return (
      <AppLayout title="Gestão Financeira">
        <div className="flex h-[50vh] items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground font-medium">Nenhum restaurante/tenant ativo encontrado.</p>
            <p className="text-sm text-muted-foreground/80">Por favor, execute "npx prisma db seed" no banco de dados.</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  // Busca as transações financeiras reais do banco PostgreSQL
  const transactions = await prisma.financialTransaction.findMany({
    where: { companyId: company.id },
    orderBy: { dueDate: "asc" },
  })

  // Converte tipos complexos (ex: Decimal do Prisma e datas) para serialização JSON
  const serializedTransactions = transactions.map((t) => ({
    id: t.id,
    description: t.description,
    type: t.type,
    value: Number(t.value),
    dueDate: t.dueDate.toISOString(),
    status: t.status,
  }))

  return (
    <AppLayout title="Gestão Financeira">
      <FinanceiroClient transactions={serializedTransactions} companyId={company.id} />
    </AppLayout>
  )
}
