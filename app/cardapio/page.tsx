import { prisma } from "@/lib/prisma"
import { AppLayout } from "@/components/layout/app-layout"
import { CardapioClient } from "@/components/cardapio/cardapio-client"

export default async function CardapioPage() {
  // Em um ambiente SaaS de produção, o domínio seria resolvido dinamicamente.
  // Carregamos a empresa demo populada pelo seeder.
  const company = await prisma.company.findUnique({
    where: { domain: "saborearte" },
  })

  if (!company) {
    return (
      <AppLayout title="Cardápio Digital">
        <div className="flex h-[50vh] items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground font-medium">Nenhum restaurante/tenant ativo encontrado.</p>
            <p className="text-sm text-muted-foreground/80">Por favor, execute "npx prisma db seed" no banco de dados.</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  // Busca as categorias e produtos da empresa logada no banco PostgreSQL da VPS
  const categories = await prisma.category.findMany({
    where: { companyId: company.id },
    orderBy: { name: "asc" },
  })

  const products = await prisma.product.findMany({
    where: { companyId: company.id },
    orderBy: { name: "asc" },
  })

  // Converte tipos complexos (ex: Decimal do Prisma) para evitar problemas de serialização
  const serializedProducts = products.map((product) => ({
    ...product,
    price: product.price.toString(),
  }))

  const serializedCategories = categories.map((cat) => ({
    ...cat,
  }))

  return (
    <AppLayout title="Cardápio Digital">
      <CardapioClient
        categories={serializedCategories}
        products={serializedProducts}
        companyId={company.id}
      />
    </AppLayout>
  )
}
