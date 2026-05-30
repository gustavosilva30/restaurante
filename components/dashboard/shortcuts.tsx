"use client"

import * as React from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ShoppingCart,
  UtensilsCrossed,
  ChefHat,
  Truck,
  Package,
  Wallet,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const shortcuts = [
  {
    title: "Abrir PDV",
    description: "Registrar vendas",
    icon: ShoppingCart,
    href: "/pdv",
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    title: "Ver Mesas",
    description: "Gerenciar salão",
    icon: UtensilsCrossed,
    href: "/mesas",
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    title: "Painel Cozinha",
    description: "Pedidos ativos",
    icon: ChefHat,
    href: "/cozinha",
    color: "text-rose-500 bg-rose-500/10",
  },
  {
    title: "Delivery",
    description: "Entregas ativas",
    icon: Truck,
    href: "/delivery",
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    title: "Estoque",
    description: "Verificar insumos",
    icon: Package,
    href: "/estoque",
    color: "text-violet-500 bg-violet-500/10",
  },
  {
    title: "Financeiro",
    description: "Contas e fluxo",
    icon: Wallet,
    href: "/financeiro",
    color: "text-primary bg-primary/10",
  },
]

export function QuickShortcuts() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Atalhos Rápidos</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shortcuts.map((shortcut, index) => (
            <motion.div
              key={shortcut.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Link href={shortcut.href}>
                <Card className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/50">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className={cn("rounded-lg p-2.5", shortcut.color)}>
                      <shortcut.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{shortcut.title}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {shortcut.description}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
