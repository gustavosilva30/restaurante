"use client"

import { AppLayout } from "@/components/layout/app-layout"
import { KfsContent } from "@/components/kfs/kfs-content"

export default function KfsPage() {
  return (
    <AppLayout title="Kitchen Flow System (KFS)">
      <KfsContent />
    </AppLayout>
  )
}
