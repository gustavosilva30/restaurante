"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Clock, MapPin, User, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const recentOrders = [
  {
    id: "ORD001",
    table: 5,
    items: 3,
    total: 156.80,
    status: "preparing",
    time: "5 min",
  },
  {
    id: "ORD002",
    table: 8,
    items: 2,
    total: 89.90,
    status: "ready",
    time: "12 min",
  },
  {
    id: "DEL001",
    customer: "Carlos O.",
    items: 4,
    total: 91.60,
    status: "delivering",
    time: "18 min",
    isDelivery: true,
  },
  {
    id: "ORD003",
    table: 12,
    items: 5,
    total: 245.50,
    status: "received",
    time: "2 min",
  },
  {
    id: "DEL002",
    customer: "Ana P.",
    items: 2,
    total: 63.70,
    status: "preparing",
    time: "8 min",
    isDelivery: true,
  },
]

const statusConfig = {
  received: { label: "Recebido", color: "bg-blue-500/10 text-blue-500" },
  preparing: { label: "Preparando", color: "bg-amber-500/10 text-amber-500" },
  ready: { label: "Pronto", color: "bg-emerald-500/10 text-emerald-500" },
  delivering: { label: "Entregando", color: "bg-violet-500/10 text-violet-500" },
}

export function RecentOrders() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Pedidos Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[360px]">
            <div className="space-y-1 px-6 pb-6">
              {recentOrders.map((order, index) => {
                const status = statusConfig[order.status as keyof typeof statusConfig]
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-lg",
                          order.isDelivery
                            ? "bg-blue-500/10 text-blue-500"
                            : "bg-primary/10 text-primary"
                        )}
                      >
                        {order.isDelivery ? (
                          <MapPin className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-bold">{order.table}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{order.id}</span>
                          <Badge variant="secondary" className={cn("text-xs", status.color)}>
                            {status.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {order.isDelivery ? (
                            <>
                              <User className="h-3 w-3" />
                              <span>{order.customer}</span>
                            </>
                          ) : (
                            <span>Mesa {order.table}</span>
                          )}
                          <span>•</span>
                          <Package className="h-3 w-3" />
                          <span>{order.items} itens</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        R$ {order.total.toFixed(2).replace(".", ",")}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{order.time}</span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  )
}
