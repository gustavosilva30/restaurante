"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { DeliveryContent } from "@/components/delivery/delivery-content"

export default function DeliveryPage() {
  return (
    <AppLayout title="Gestão de Delivery">
      <DeliveryContent />
    </AppLayout>
  )
}
