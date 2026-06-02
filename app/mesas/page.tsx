import { prisma } from "@/lib/prisma"
import { AppLayout } from "@/components/layout/app-layout"
import { TablesContent } from "@/components/mesas/tables-content"

export default async function MesasPage() {
  // Carregamos a empresa demo populada pelo seeder
  const company = await prisma.company.findUnique({
    where: { domain: "saborearte" },
  })

  if (!company) {
    return (
      <AppLayout title="Gerenciamento de Mesas">
        <div className="flex h-[50vh] items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground font-medium">Nenhum restaurante/tenant ativo encontrado.</p>
            <p className="text-sm text-muted-foreground/80">Por favor, execute "npx prisma db seed" no banco de dados.</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  // Busca mesas reais do banco de dados na VPS
  const dbTables = await prisma.table.findMany({
    where: { companyId: company.id },
    orderBy: { number: "asc" },
  })

  // Converte mesas reais do banco, mapeando dinamicamente atributos visuais (area/shape)
  const serializedTables = dbTables.map((table) => {
    // Determina a Área com base no número da mesa
    let area: "main" | "garden" | "vip" = "main"
    if (table.number >= 20) area = "vip"
    else if (table.number >= 11) area = "garden"

    // Determina o Formato com base na capacidade da mesa
    let shape: "round" | "square" | "rectangle" = "square"
    if (table.capacity >= 8) shape = "rectangle"
    else if (table.capacity === 2) shape = "round"

    return {
      id: table.id,
      number: table.number,
      capacity: table.capacity,
      status: table.status as any,
      shape,
      area,
      x: table.x,
      y: table.y,
      reservationName: table.reservationName || undefined,
      reservationTime: table.reservationTime 
        ? new Date(table.reservationTime).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) 
        : undefined,
    }
  })

  return (
    <AppLayout title="Gerenciamento de Mesas">
      <TablesContent initialTables={serializedTables} companyId={company.id} />
    </AppLayout>
  )
}
