"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { KitchenContent } from "@/components/cozinha/kitchen-content"

export default function CozinhaPage() {
  return (
    <AppLayout title="Painel da Cozinha (KDS)">
      <KitchenContent />
    </AppLayout>
  )
}
