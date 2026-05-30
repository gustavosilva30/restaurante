"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Truck,
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  ChefHat,
  Package,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { mockDashboardData, mockTables } from "@/lib/mock-data"

// Live orders feed
export function LiveOrdersFeed() {
  const [orders, setOrders] = React.useState(mockDashboardData.recentOrders)

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bg: string; icon: React.ElementType; label: string }> = {
      pending: { color: "text-amber-500", bg: "bg-amber-500/10", icon: Clock, label: "Aguardando" },
      preparing: { color: "text-blue-500", bg: "bg-blue-500/10", icon: ChefHat, label: "Preparando" },
      ready: { color: "text-emerald-500", bg: "bg-emerald-500/10", icon: Package, label: "Pronto" },
      delivering: { color: "text-indigo-500", bg: "bg-indigo-500/10", icon: Truck, label: "Entregando" },
      completed: { color: "text-zinc-500", bg: "bg-zinc-500/10", icon: CheckCircle2, label: "Concluído" },
    }
    return configs[status] || configs.pending
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="border-0 bg-card/50 backdrop-blur-sm h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Pedidos Recentes</CardTitle>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">Ao vivo</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <AnimatePresence mode="popLayout">
            {orders.map((order, index) => {
              const statusConfig = getStatusConfig(order.status)
              const StatusIcon = statusConfig.icon
              
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ delay: index * 0.05 }}
                  className="group flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className={cn("p-2 rounded-lg", statusConfig.bg)}>
                    <StatusIcon className={cn("h-4 w-4", statusConfig.color)} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{order.id}</span>
                      {order.isDelivery ? (
                        <Badge variant="outline" className="h-5 text-[10px] gap-1">
                          <Truck className="h-3 w-3" />
                          Delivery
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="h-5 text-[10px] gap-1">
                          <UtensilsCrossed className="h-3 w-3" />
                          Mesa {order.table}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {order.items} itens
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {order.time}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-bold">
                      R$ {order.total.toFixed(2).replace(".", ",")}
                    </p>
                    <Badge className={cn("text-[10px] h-5", statusConfig.bg, statusConfig.color)} variant="secondary">
                      {statusConfig.label}
                    </Badge>
                  </div>
                  
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              )
            })}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Tables map mini view
export function TablesMapMini() {
  const tableData = mockTables
  const occupiedCount = tableData.filter(t => t.status === "occupied").length
  const totalRevenue = tableData
    .filter(t => t.status === "occupied" || t.status === "closing")
    .reduce((acc, t) => acc + (t.totalAmount || 0), 0)

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      free: "bg-emerald-500/20 border-emerald-500/50",
      occupied: "bg-blue-500/20 border-blue-500/50",
      reserved: "bg-amber-500/20 border-amber-500/50",
      closing: "bg-indigo-500/20 border-indigo-500/50",
    }
    return colors[status] || colors.free
  }

  const getStatusDot = (status: string) => {
    const colors: Record<string, string> = {
      free: "bg-emerald-500",
      occupied: "bg-blue-500",
      reserved: "bg-amber-500",
      closing: "bg-indigo-500",
    }
    return colors[status] || colors.free
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <Card className="border-0 bg-card/50 backdrop-blur-sm h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Mapa de Mesas</CardTitle>
            <Badge variant="secondary" className="font-mono">
              {occupiedCount}/{tableData.length}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Faturamento: <strong className="text-foreground">R$ {totalRevenue.toLocaleString("pt-BR")}</strong></span>
          </div>
        </CardHeader>
        <CardContent>
          {/* Mini grid representation */}
          <div className="grid grid-cols-5 gap-2">
            {tableData.slice(0, 20).map((table, index) => (
              <motion.div
                key={table.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                className={cn(
                  "relative aspect-square rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-105 hover:shadow-lg group",
                  getStatusColor(table.status)
                )}
                title={`Mesa ${table.number} - ${table.status === "occupied" ? `R$ ${table.totalAmount?.toFixed(2)}` : table.status}`}
              >
                <span className="text-xs font-bold">{table.number}</span>
                
                {/* Pulse for occupied tables */}
                {(table.status === "occupied" || table.status === "closing") && (
                  <div className="absolute -top-0.5 -right-0.5">
                    <div className={cn("h-2 w-2 rounded-full", getStatusDot(table.status))} />
                    <div className={cn("absolute inset-0 h-2 w-2 rounded-full animate-ping", getStatusDot(table.status), "opacity-75")} />
                  </div>
                )}
                
                {/* Hover tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                  <p className="text-xs font-semibold">Mesa {table.number}</p>
                  {table.totalAmount && (
                    <p className="text-xs text-muted-foreground">
                      R$ {table.totalAmount.toFixed(2)}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border/50">
            {[
              { status: "Livre", color: "bg-emerald-500" },
              { status: "Ocupada", color: "bg-blue-500" },
              { status: "Reservada", color: "bg-amber-500" },
              { status: "Fechando", color: "bg-indigo-500" },
            ].map(item => (
              <div key={item.status} className="flex items-center gap-1.5">
                <div className={cn("h-2 w-2 rounded-full", item.color)} />
                <span className="text-[10px] text-muted-foreground">{item.status}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Goals progress
export function GoalsProgress() {
  const { goals } = mockDashboardData

  const goalsData = [
    { label: "Vendas do Dia", ...goals.dailySales, color: "bg-emerald-500", format: (v: number) => `R$ ${v.toLocaleString("pt-BR")}` },
    { label: "Faturamento Mensal", ...goals.monthlyRevenue, color: "bg-blue-500", format: (v: number) => `R$ ${(v/1000).toFixed(0)}k` },
    { label: "Satisfação", ...goals.customerSatisfaction, color: "bg-amber-500", format: (v: number) => `${v}%` },
    { label: "Ticket Médio", ...goals.averageTicket, color: "bg-indigo-500", format: (v: number) => `R$ ${v.toFixed(2)}` },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Metas do Período</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {goalsData.map((goal, index) => (
            <motion.div
              key={goal.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium">{goal.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {goal.format(goal.current)}
                  </span>
                  <span className="text-xs text-muted-foreground">/</span>
                  <span className="text-sm font-semibold">
                    {goal.format(goal.target)}
                  </span>
                </div>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={cn("h-full rounded-full", goal.color)}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(goal.percentage, 100)}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
                {/* Target line */}
                <div className="absolute top-0 bottom-0 w-0.5 bg-foreground/30" style={{ left: "100%" }} />
              </div>
              <div className="flex items-center justify-end mt-1">
                <Badge 
                  variant={goal.percentage >= 100 ? "default" : "secondary"} 
                  className="text-[10px] h-4"
                >
                  {goal.percentage}%
                </Badge>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Staff ranking
export function StaffRanking() {
  const { staffPerformance } = mockDashboardData

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.9 }}
    >
      <Card className="border-0 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Desempenho da Equipe</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {staffPerformance.map((staff, index) => (
            <motion.div
              key={staff.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                index === 0 ? "bg-amber-500/20 text-amber-500" :
                index === 1 ? "bg-zinc-400/20 text-zinc-400" :
                index === 2 ? "bg-orange-600/20 text-orange-600" :
                "bg-muted text-muted-foreground"
              )}>
                {staff.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{staff.name}</p>
                <p className="text-xs text-muted-foreground">{staff.role}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">R$ {staff.revenue.toLocaleString("pt-BR")}</p>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">{staff.orders} pedidos</span>
                  <span className="text-xs text-amber-500">★ {staff.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  )
}
