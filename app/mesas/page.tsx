"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { TablesContent } from "@/components/mesas/tables-content"

export default function MesasPage() {
  return (
    <AppLayout title="Gerenciamento de Mesas">
      <TablesContent />
    </AppLayout>
  )
}
